import { getEscapedHtml } from "../utils";
import { NoteStorageStrategy } from "./storage";
import { Note, NoteMeta } from "@/entities/note/types";

const INDEX_FILE = "index.json";

export class FileSystemNoteStrategy implements NoteStorageStrategy {
  private index: Record<string, NoteMeta> = {};
  private root!: FileSystemDirectoryHandle;

  public async initialize() {
    this.root = await navigator.storage.getDirectory();
    const handle = await this.root.getFileHandle(INDEX_FILE, { create: true });
    const file = await handle.getFile();

    // if it's new user - there's no indexing file yet and parse throws error
    try {
      this.index = JSON.parse(await file.text());
    } catch (e) {
      this.index = {};
    }
  }

  private async saveIndex() {
    const handle = await this.root.getFileHandle(INDEX_FILE, { create: true });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(this.index));
    await writable.close();
  }

  async create(newNote: Omit<Note, "createdAt" | "updatedAt">): Promise<Note> {
    return {} as Note;
  }

  async update(updatedNote: Note) {
    // this needs to be somehow refactored
    const note = { ...updatedNote, updatedAt: Date.now() };
    const snippet =
      getEscapedHtml(note.content.slice(0, 100)) +
      (note.content.length > 100 ? "..." : "");

    const fileHandle = await this.root.getFileHandle(note.id, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    const data = note.content;
    writable.write(data);
    writable.close();

    this.index[note.id] = {
      id: note.id,
      label: note.label,
      tags: note.tags,
      isEncrypted: note.isEncrypted,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      snippet,
    };
    await this.saveIndex();
    return note;
  }

  async delete(noteId: string) {
    await this.root.removeEntry(noteId);
    delete this.index[noteId];
    await this.saveIndex();
  }

  public async clear() {
    // @ts-ignore
    return this.root.remove({ recursive: true });
  }

  async getByName(noteId: string): Promise<Note | null> {
    const entry = this.index[noteId];
    if (!entry) return null;

    const fileHandle = await this.root.getFileHandle(noteId);
    const file = await fileHandle.getFile();

    const content = await file.text();
    return { ...entry, content };
  }

  async getAll(): Promise<NoteMeta[]> {
    return Object.values(this.index);
  }
  async getStorageEstimate(): Promise<StorageEstimate> {
    return navigator.storage.estimate();
  }

  async import(note: Blob) {
    const noteData: Note = JSON.parse(await note.text());
    if (!noteData.id) throw new Error("Imported note must have an id");

    await this.update(noteData);
  }

  async export(noteId: string) {
    const note = await this.getByName(noteId);
    if (!note) throw new Error("Note not found");
    return new Blob([JSON.stringify(note)], { type: "application/json" });
  }
}

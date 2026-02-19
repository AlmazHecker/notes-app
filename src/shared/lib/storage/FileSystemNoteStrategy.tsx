import { getEscapedHtml } from "../utils";
import { NoteStorageStrategy } from "./storage";
import { Note, NoteMeta } from "@/entities/note/types";

const INDEX_FILE = "index.json";

export class FileSystemNoteStrategy implements NoteStorageStrategy {
  private index: Record<string, NoteMeta> = {};
  private root!: FileSystemDirectoryHandle;
  private directoryStack: FileSystemDirectoryHandle[] = [];
  private pathStack: string[] = [];
  private pathIdStack: string[] = [];

  private get currentDir() {
    return this.directoryStack[this.directoryStack.length - 1];
  }

  public async initialize() {
    this.root = await navigator.storage.getDirectory();
    this.directoryStack = [this.root];
    this.pathStack = [];
    this.pathIdStack = [];
    await this.loadIndex();
  }

  public async initializeWithPathIds(ids: string[]) {
    await this.initialize();
    for (const id of ids) {
      try {
        await this.cd(id);
      } catch (e) {
        // Stop if a folder in the path is missing
        break;
      }
    }
  }

  private async loadIndex() {
    try {
      const handle = await this.currentDir.getFileHandle(INDEX_FILE, {
        create: true,
      });
      const file = await handle.getFile();
      const text = await file.text();
      this.index = text ? JSON.parse(text) : {};
    } catch (e) {
      this.index = {};
    }
  }

  private async saveIndex() {
    const handle = await this.currentDir.getFileHandle(INDEX_FILE, {
      create: true,
    });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(this.index));
    await writable.close();
  }

  async create(newNote: Omit<Note, "createdAt" | "updatedAt">): Promise<Note> {
    const note: Note = {
      ...newNote,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      type: "note",
    };
    return this.update(note);
  }

  async update(updatedNote: Note) {
    const note = { ...updatedNote, updatedAt: Date.now() };
    const snippet =
      getEscapedHtml(note.content.slice(0, 100)) +
      (note.content.length > 100 ? "..." : "");

    const fileHandle = await this.currentDir.getFileHandle(note.id, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    const data = note.content;
    await writable.write(data);
    await writable.close();

    this.index[note.id] = {
      id: note.id,
      label: note.label,
      tags: note.tags,
      isEncrypted: note.isEncrypted,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      snippet,
      type: "note",
    };
    await this.saveIndex();
    return note;
  }

  async delete(noteId: string) {
    const entry = this.index[noteId];
    if (!entry) return;

    if (entry.type === "folder") {
      // @ts-ignore
      await this.currentDir.removeEntry(noteId, { recursive: true });
    } else {
      await this.currentDir.removeEntry(noteId);
    }

    delete this.index[noteId];
    await this.saveIndex();
  }

  public async clear() {
    // @ts-ignore
    await this.root.remove({ recursive: true });
    await this.initialize();
  }

  async getByName(noteId: string): Promise<Note | null> {
    const entry = this.index[noteId];
    if (!entry || entry.type === "folder") return null;

    const fileHandle = await this.currentDir.getFileHandle(noteId);
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

  async cd(folderId: string): Promise<void> {
    const entry = this.index[folderId];
    if (!entry || entry.type !== "folder") {
      throw new Error("Folder not found");
    }

    const handle = await this.currentDir.getDirectoryHandle(folderId);
    this.directoryStack.push(handle);
    this.pathStack.push(entry.label);
    this.pathIdStack.push(folderId);
    await this.loadIndex();
  }

  async goBack(): Promise<void> {
    if (this.directoryStack.length > 1) {
      this.directoryStack.pop();
      this.pathStack.pop();
      this.pathIdStack.pop();
      await this.loadIndex();
    }
  }

  getCurrentPath(): string[] {
    return this.pathStack;
  }

  getPathIds(): string[] {
    return this.pathIdStack;
  }

  async createFolder(label: string): Promise<NoteMeta> {
    const id = crypto.randomUUID();
    await this.currentDir.getDirectoryHandle(id, { create: true });

    const folderMeta: NoteMeta = {
      id,
      label,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isEncrypted: false,
      snippet: "",
      type: "folder",
    };

    this.index[id] = folderMeta;
    await this.saveIndex();

    // Initialize the folder with an empty index
    const folderHandle = await this.currentDir.getDirectoryHandle(id);
    const indexHandle = await folderHandle.getFileHandle(INDEX_FILE, {
      create: true,
    });
    const writable = await indexHandle.createWritable();
    await writable.write(JSON.stringify({}));
    await writable.close();

    return folderMeta;
  }

  private async updateFolderIndex(
    folderHandle: FileSystemDirectoryHandle,
    updateFn: (index: Record<string, NoteMeta>) => void,
  ) {
    const indexHandle = await folderHandle.getFileHandle(INDEX_FILE, {
      create: true,
    });
    const file = await indexHandle.getFile();
    const text = await file.text();
    const index = text ? JSON.parse(text) : {};

    updateFn(index);

    const writable = await indexHandle.createWritable();
    await writable.write(JSON.stringify(index));
    await writable.close();
  }

  async moveEntry(id: string, targetFolderId: string): Promise<void> {
    const entry = this.index[id];
    if (!entry) return;

    if (id === targetFolderId) return;

    let handle: FileSystemFileHandle | FileSystemDirectoryHandle;
    if (entry.type === "folder") {
      handle = await this.currentDir.getDirectoryHandle(id);
    } else {
      handle = await this.currentDir.getFileHandle(id);
    }

    const targetDirHandle =
      await this.currentDir.getDirectoryHandle(targetFolderId);

    // @ts-ignore
    if (typeof handle.move === "function") {
      // @ts-ignore
      await handle.move(targetDirHandle);
    } else {
      throw new Error("Your browser does not support moving files in OPFS");
    }

    delete this.index[id];
    await this.saveIndex();

    await this.updateFolderIndex(targetDirHandle, (targetIndex) => {
      targetIndex[id] = { ...entry, updatedAt: Date.now() };
    });
  }
}

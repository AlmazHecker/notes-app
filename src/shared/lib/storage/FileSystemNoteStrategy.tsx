import { getFolderHandle, verifyPermission } from "../fileApi";
import { NoteStorageStrategy } from "./storage";
import { Note } from "@/entities/note/types";

const PREFIX = ".azych";

export class FileSystemNoteStrategy implements NoteStorageStrategy {
  private getPrefixedName(noteId: string) {
    return `${noteId}${PREFIX}`;
  }

  async getByName(noteId: string): Promise<Note> {
    const file = await this.getFileByName(noteId);
    return JSON.parse(await file.text());
  }

  async getFileByName(noteId: string): Promise<File> {
    const folderHandle = await getFolderHandle();

    const fileHandle = await folderHandle.getFileHandle(
      this.getPrefixedName(noteId)
    );

    return fileHandle.getFile();
  }

  async update(updatedNote: Note): Promise<Note> {
    const folderHandle = await getFolderHandle();
    const note = { ...updatedNote, tags: [], updatedAt: Date.now() };

    await verifyPermission();

    const handle = await folderHandle.getFileHandle(
      this.getPrefixedName(note.id),
      { create: true }
    );
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(note));
    await writable.close();
    return note;
  }

  async delete(noteId: string) {
    const folderHandle = await getFolderHandle();
    return folderHandle.removeEntry(this.getPrefixedName(noteId));
  }

  async getAll(): Promise<Note[]> {
    const folderHandle = await getFolderHandle();

    const notes: Note[] = [];
    for await (const [, handle] of folderHandle.entries()) {
      if (handle.kind === "file" && handle.name.endsWith(PREFIX)) {
        const file = await handle.getFile();
        notes.push(JSON.parse(await file.text()));
      }
    }
    return notes;
  }

  async create(newNote: Omit<Note, "createdAt" | "updatedAt">) {
    const folderHandle = await getFolderHandle();
    await verifyPermission();

    const note: Note = {
      ...newNote,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const handle = await folderHandle.getFileHandle(
      this.getPrefixedName(note.id),
      { create: true }
    );
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(note));
    await writable.close();
  }

  async import(noteId: string, noteBlob: Blob) {
    const folderHandle = await getFolderHandle();
    const handle = await folderHandle.getFileHandle(
      this.getPrefixedName(noteId),
      { create: true }
    );
    const writable = await handle.createWritable();
    await writable.write(noteBlob);
    await writable.close();
  }

  async getTotalSize(): Promise<number> {
    const handle = await getFolderHandle();
    let totalSize = 0;

    for await (const [name, entry] of handle.entries()) {
      if (entry.kind === "file") {
        const file = await entry.getFile();
        totalSize += file.size;
      }
    }

    return totalSize;
  }
}

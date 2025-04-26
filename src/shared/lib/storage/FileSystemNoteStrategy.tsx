import { getFolderHandle } from "../fileApi";
import { Note } from "../notesDB";
import { NoteStorageStrategy } from "./storage";

export class FileSystemNoteStrategy implements NoteStorageStrategy {
  async getByName(noteId: string): Promise<Note | null> {
    const folderHandle = await getFolderHandle();
    const fileHandle = await folderHandle.getFileHandle(`${noteId}`);
    const file = await fileHandle.getFile();
    return JSON.parse(await file.text());
  }

  async update(updatedNote: Note): Promise<Note> {
    const folderHandle = await getFolderHandle();
    const note = {
      ...updatedNote,
      tags: [],
      updatedAt: Date.now(),
    };
    const handle = await folderHandle.getFileHandle(note.id, { create: true });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(note));
    await writable.close();
    return note;
  }

  async delete(noteId: string) {
    const folderHandle = await getFolderHandle();
    await folderHandle.removeEntry(noteId);
  }

  async getAll(): Promise<Note[]> {
    const folderHandle = await getFolderHandle();
    const notes: Note[] = [];
    for await (const [, handle] of folderHandle.entries()) {
      if (handle.kind === "file") {
        const file = await handle.getFile();
        notes.push(JSON.parse(await file.text()));
      }
    }
    return notes;
  }

  async create(newNote: Omit<Note, "createdAt" | "updatedAt">) {
    const folderHandle = await getFolderHandle();
    const note: Note = {
      ...newNote,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const handle = await folderHandle.getFileHandle(note.id, { create: true });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(note));
    await writable.close();
  }

  async import(noteId: string, noteBlob: Blob) {
    const folderHandle = await getFolderHandle();
    const handle = await folderHandle.getFileHandle(noteId, { create: true });
    const writable = await handle.createWritable();
    await writable.write(noteBlob);
    await writable.close();
  }
}

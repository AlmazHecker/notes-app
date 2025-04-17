import { getFolderHandle } from "@/lib/fileApi";
import type { Note } from "@/lib/notesDB";

export class NoteService {
  static async getByName(noteId: string): Promise<Note | null> {
    try {
      const folderHandle = await getFolderHandle();
      const fileHandle = await folderHandle.getFileHandle(`${noteId}`);
      const file = await fileHandle.getFile();
      const fileData = JSON.parse(await file.text());
      return fileData;
    } catch (err) {
      console.error("File not found:", noteId);
      return null;
    }
  }

  static async update(note: Note) {
    const folderHandle = await getFolderHandle();

    const newFileHandle = await folderHandle.getFileHandle(note.label, {
      create: true,
    });
    const writable = await newFileHandle.createWritable();
    await writable.write(note.content);
    await writable.close();

    return note;
  }

  static async delete(noteId: string) {
    const folderHandle = await getFolderHandle();
    await folderHandle.removeEntry(noteId);
  }

  static async getAll() {
    const folderHandle = await getFolderHandle();

    const notes: Note[] = [];

    for await (const [name, handle] of folderHandle.entries()) {
      if (handle.kind === "file") {
        const file = await handle.getFile();
        const fileData = JSON.parse(await file.text());

        notes.push(fileData); // TEMP ID
      }
    }

    return notes;
  }

  static async create(newNote: Omit<Note, "id" | "createdAt" | "updatedAt">) {
    const folderHandle = await getFolderHandle();

    const id = crypto.randomUUID();

    const note: Note = {
      ...newNote,
      id,
      isEncrypted: false,
      tags: [],
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    const fileHandle = await folderHandle.getFileHandle(note.id, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(note));
    await writable.close();
  }
}

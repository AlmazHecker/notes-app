import { getFolderHandle } from "@/lib/fileApi";
import type { Note } from "@/lib/notesDB";

export class NoteService {
  static async getByName(noteId: string): Promise<Note | null> {
    const folderHandle = await getFolderHandle();
    const fileHandle = await folderHandle.getFileHandle(`${noteId}`);
    const file = await fileHandle.getFile();
    const fileData = JSON.parse(await file.text());
    return fileData;
  }

  static async update(updatedNote: Note) {
    const folderHandle = await getFolderHandle();

    const note: Note = {
      ...updatedNote,
      tags: [],
      updatedAt: new Date().getTime(),
    };

    const newFileHandle = await folderHandle.getFileHandle(note.id, {
      create: true,
    });
    const writable = await newFileHandle.createWritable();
    await writable.write(JSON.stringify(note));
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

        notes.push(fileData);
      }
    }

    return notes;
  }

  static async create(newNote: Omit<Note, "createdAt" | "updatedAt">) {
    const folderHandle = await getFolderHandle();

    const note: Note = {
      ...newNote,
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

  static async import(noteId: string, note: Blob) {
    const folderHandle = await getFolderHandle();

    const fileHandle = await folderHandle.getFileHandle(noteId, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(note);
    await writable.close();
  }

  static async createFolder(folderName: string) {
    const dirHandle = await window.showDirectoryPicker();

    const newFolderHandle = await dirHandle.getDirectoryHandle(folderName, {
      create: true,
    });

    return newFolderHandle;
  }
}

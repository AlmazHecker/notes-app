import { getFolderHandle } from "@/lib/fileApi";
import type { Note } from "@/lib/notesDB";

export class NoteService {
  static async getByName(filename: string): Promise<Note | null> {
    try {
      const folderHandle = await getFolderHandle();
      const fileHandle = await folderHandle.getFileHandle(filename);
      const file = await fileHandle.getFile();
      const content = await file.text();
      return { content, label: filename };
    } catch (err) {
      console.error("File not found:", filename);
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

  static async delete(label: string) {
    const folderHandle = await getFolderHandle();
    await folderHandle.removeEntry(label);
  }

  static async getAll() {
    const folderHandle = await getFolderHandle();

    const notes: Note[] = [];

    for await (const [name, handle] of folderHandle.entries()) {
      if (handle.kind === "file") {
        const file = await handle.getFile();
        const text = await file.text();
        notes.push({ label: name, content: text, id: Math.random() }); // TEMP ID
      }
    }

    return notes;
  }

  static async create(note: Note) {
    const folderHandle = await getFolderHandle();

    const fileHandle = await folderHandle.getFileHandle(note.label, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(note.content);
    await writable.close();
  }
}

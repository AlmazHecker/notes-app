import { Note } from "@/entities/note/types";

export interface NoteStorageStrategy {
  getByName(noteId: string): Promise<Note | null>;
  getFileByName(noteId: string): Promise<Blob>;
  update(note: Note): Promise<Note>;
  delete(noteId: string): Promise<void>;
  getAll(): Promise<Note[]>;
  create(newNote: Omit<Note, "createdAt" | "updatedAt">): Promise<void>;
  import(noteId: string, noteBlob: Blob): Promise<void>;
  getTotalSize(): Promise<number>;
}

import { Note, NoteMeta } from "@/entities/note/types";

export interface NoteStorageStrategy {
  getByName(noteId: string): Promise<Note | null>;
  update(note: Note): Promise<Note>;
  delete(noteId: string): Promise<void>;
  getAll(): Promise<NoteMeta[]>;
  create(newNote: Omit<Note, "createdAt" | "updatedAt">): Promise<Note>;
  import(noteBlob: Blob): Promise<void>;
  getStorageEstimate(): Promise<StorageEstimate>;
  createFolder(label: string): Promise<NoteMeta>;
  initialize(ids: string[]): Promise<string>;
  moveEntry(id: string, targetFolderId: string): Promise<void>;
  renameEntry(id: string, newLabel: string): Promise<void>;
  exportFull(): Promise<Blob>;
}

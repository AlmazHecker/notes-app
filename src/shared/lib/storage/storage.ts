import { Note, NoteMeta } from "@/entities/note/types";

export interface NoteStorageStrategy {
  getByName(noteId: string): Promise<Note | null>;
  update(note: Note): Promise<Note>;
  delete(noteId: string): Promise<void>;
  getAll(): Promise<NoteMeta[]>;
  create(newNote: Omit<Note, "createdAt" | "updatedAt">): Promise<Note>;
  import(noteBlob: Blob): Promise<void>;
  getStorageEstimate(): Promise<StorageEstimate>;
  cd(folderId: string): Promise<void>;
  goBack(): Promise<void>;
  getCurrentPath(): string[];
  getPathIds(): string[];
  createFolder(label: string): Promise<NoteMeta>;
  initializeWithPathIds(ids: string[]): Promise<void>;
  moveEntry(id: string, targetFolderId: string): Promise<void>;
  renameEntry(id: string, newLabel: string): Promise<void>;
  exportFull(): Promise<Blob>;
}

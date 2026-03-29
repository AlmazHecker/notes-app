import { Note, NoteMeta, RawNoteContent } from "@/entities/note/types";

export interface NoteStorageStrategy {
  getMeta(noteId: string): Promise<NoteMeta | null>;
  getContent(noteId: string): Promise<RawNoteContent>;
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

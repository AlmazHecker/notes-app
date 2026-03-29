import { Entry } from "@/entities/entry/types";
import { FolderEntry } from "@/entities/folder/types";
import { Note, RawNoteContent } from "@/entities/note/types";

export interface NoteStorageStrategy {
  getMeta(noteId: string): Promise<Entry | null>;
  getContent(noteId: string): Promise<RawNoteContent>;
  create(newNote: Omit<Note, "createdAt" | "updatedAt">): Promise<Note>;
  update(note: Note): Promise<Note>;
  delete(noteId: string): Promise<void>;
  move(id: string, targetFolderId: string): Promise<void>;
  rename(id: string, newLabel: string): Promise<void>;
  getAll(): Promise<Entry[]>;
  import(noteBlob: Blob): Promise<void>;
  getStorageEstimate(): Promise<StorageEstimate>;
  createFolder(label: string): Promise<FolderEntry>;
  initialize(ids: string[]): Promise<string>;
  exportFull(): Promise<Blob>;
}

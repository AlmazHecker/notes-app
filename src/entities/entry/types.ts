import type { FolderEntry } from "../folder/types";
import type { NoteEntry } from "../note/types";

export type BaseEntry = {
  id: string;
  label: string;
  createdAt: number;
  updatedAt: number;
  // currently we can encrypt files only but
  // there will be feature of encryption folders
  isEncrypted: boolean;
};

export type Entry = FolderEntry | NoteEntry;

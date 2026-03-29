import { Entry } from "../entry/types";

export type Note = NoteMeta & {
  content: RawNoteContent;
};

// this should be refactored
export interface NoteMeta extends Entry {
  snippet: string; // short preview
  type: "note" | "folder";
  tags?: string[];
}

export type RawNoteContent = Uint8Array<ArrayBuffer>;

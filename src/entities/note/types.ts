import { BaseEntry } from "../entry/types";

export type Note = NoteEntry & {
  content: RawNoteContent;
};

export type NoteEntry = BaseEntry & {
  type: "file";
  snippet: string;
  tags?: string[];
};

export type RawNoteContent = Uint8Array<ArrayBuffer>;

export type Note = NoteMeta & RawNote;

export type NoteMeta = {
  id: string;
  label: string;
  createdAt: number;
  updatedAt: number;
  isEncrypted: boolean;
  tags?: string[];
  snippet: string; // short preview
  type: "note" | "folder";
};

export type RawNote = {
  content: string;
};

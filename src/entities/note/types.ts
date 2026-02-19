export type Note = NoteMeta & RawNote;

export type NoteMeta = {
  id: string;
  label: string;
  createdAt: number;
  updatedAt: number;
  isEncrypted: boolean;
  tags?: string[];
  snippet: string; // short preview
};

export type RawNote = {
  content: string;
};

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

export type NoteEntry = BaseEntry & {
  type: "file";
  snippet: string;
  tags?: string[];
  content: Uint8Array<ArrayBuffer>;
};

export type FolderEntry = BaseEntry & {
  type: "folder";
};

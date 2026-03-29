export interface Entry {
  id: string;
  label: string;
  createdAt: number;
  updatedAt: number;
  isEncrypted: boolean;
  type: "note" | "folder";
}

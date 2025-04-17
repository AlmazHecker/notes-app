export type Note = {
  id: string;
  label: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isEncrypted: boolean;
  tags?: string[];
  // Additional metadata for encrypted notes
  // encryptionMeta?: {
  //   requiresPassword?: boolean;
  // };
};

import { openDB, IDBPDatabase, DBSchema } from "idb";
import { z } from "zod";

export const noteSchema = z.object({
  label: z.string().min(2, { message: "Label too short." }),
  content: z.string().min(5, { message: "Content too short." }),
});

export type Note = { id?: number } & z.infer<typeof noteSchema>;
export type EncryptedNote = { id?: number; value: string };

interface NotesDB extends DBSchema {
  notes: {
    key: number;
    value: EncryptedNote; // encrypted string
  };
}

let dbInstance: IDBPDatabase<NotesDB> | null = null;

export const getNotesDB = async (): Promise<IDBPDatabase<NotesDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<NotesDB>("notes-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });

  return dbInstance;
};

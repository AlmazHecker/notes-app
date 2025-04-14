"use client";

import { useEffect, useState } from "react";
import { getNotesDB, Note } from "@/lib/notesDB";
import { useRouter } from "next/navigation";
import { decrypt, getHardcodedKey } from "@/lib/cryptoUtils";

export function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleNoteClick = (noteId?: number) => {
    return router.push(`?id=${noteId}`);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      const notesDB = await getNotesDB();
      const stored = await notesDB.getAll("notes");

      const key = await getHardcodedKey();

      const decryptedNotes = await Promise.all<Note>(
        (stored || []).map(async (note) => {
          try {
            const [iv, encrypted] = note.value.split("---");

            const decrypted = await decrypt(key, encrypted, iv);
            const parsed = JSON.parse(decrypted) as Note;
            return {
              id: note.id,
              label: parsed.label,
              content: parsed.content,
            };
          } catch (e) {
            console.error("Failed to decrypt note:", e);
            return {
              id: note.id,
              label: "⚠️ Decryption Failed",
              content: "",
            };
          }
        }),
      );

      setNotes(decryptedNotes);
      setIsLoading(false);
    };

    fetchNotes();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-gray-900 border-gray-300" />
        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!notes.length) {
    return <p className="text-muted-foreground p-4">No notes saved yet.</p>;
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Saved Notes</h2>
      <div className="grid gap-4">
        {notes.map((note, i) => (
          <div
            key={i}
            className="p-4 rounded-md border"
            onClick={() => handleNoteClick(note.id)}
          >
            <h3 className="font-semibold">{note.label}</h3>
            <p className="text-sm text-muted-foreground">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

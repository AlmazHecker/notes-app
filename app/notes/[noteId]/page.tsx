// CurrentNote.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { openDB } from "idb";

export function CurrentNote() {
  const params = useParams();
  const id = Number(params?.id);
  const [note, setNote] = useState<{ label: string; content: string } | null>(
    null,
  );

  useEffect(() => {
    if (!isNaN(id)) {
      (async () => {
        const notesDB = await openDB("notes-db", 1);
        const foundNote = await notesDB.get("notes", id);
        if (foundNote) {
          setNote({ label: foundNote.label, content: foundNote.content });
        }
      })();
    }
  }, [id]);

  if (!note) return <div className="p-4">Note not found or loading...</div>;

  return (
    <div className="p-6 border rounded-xl space-y-4 shadow">
      <h1 className="text-2xl font-bold">{note.label}</h1>
      <p className="text-base">{note.content}</p>
    </div>
  );
}

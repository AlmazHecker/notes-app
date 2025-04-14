"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { openDB } from "idb";
import { Note } from "@/lib/notesDB";

export default function Page() {
  const params = useSearchParams();
  const id = Number(params?.get("id"));
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    if (!isNaN(id)) {
      (async () => {
        const notesDB = await openDB("notes-db", 1);
        const foundNote = await notesDB.get("notes", id);
        if (foundNote) {
          setNote(foundNote);
        }
      })();
    }
  }, [id]);

  if (!note) return <div className="p-4">Note not found or loading...</div>;

  return (
    <div className="p-6 space-y-4 ">
      <h1 className="text-2xl font-bold">{note.label}</h1>
      <p className="text-base">{note.content}</p>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Note } from "@/lib/notesDB";

export function CurrentNote() {
  const params = new URLSearchParams(window.location.search);
  const noteId = params.get("noteId");

  const [note, setNote] = useState<Note | null>(null);

  //   useEffect(() => {
  //     if (!isNaN(id)) {
  //       db.notes.get(id).then(setNote);
  //     }
  //   }, [id]);

  if (!note) return <div className="p-4">Note not found or loading...</div>;

  return (
    <div className="p-4 border rounded-xl space-y-4 shadow">
      <h1 className="text-2xl font-bold">{note.label}</h1>
      <p className="text-base">{note.content}</p>
    </div>
  );
}

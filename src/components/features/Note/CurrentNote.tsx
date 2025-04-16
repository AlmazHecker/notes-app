"use client";

import { useEffect, useState } from "react";
import type { Note } from "@/lib/notesDB";
import { getFolderHandle } from "@/lib/fileApi";

export function CurrentNote() {
  const params = new URLSearchParams(window.location.search);
  const noteId = params.get("noteId");

  const [note, setNote] = useState<Note | null>(null);

  const getFileByName = async (filename: string) => {
    try {
      const folderHandle = await getFolderHandle();
      const fileHandle = await folderHandle.getFileHandle(filename);
      const file = await fileHandle.getFile();
      const content = await file.text();
      setNote({ content, label: filename });
      return content;
    } catch (err) {
      console.error("File not found:", filename);
      return null;
    }
  };

  useEffect(() => {
    if (noteId) {
      getFileByName(noteId);
    }
  }, []);

  if (!note) return <div className="p-4">Note not found or loading...</div>;

  return (
    <div className="p-4 border space-y-4 shadow">
      <h1 className="text-2xl font-bold">{note.label}</h1>
      <p className="text-base">{note.content}</p>
    </div>
  );
}

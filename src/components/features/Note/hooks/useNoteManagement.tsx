import { useState } from "react";
import { Note } from "@/lib/notesDB";
import { NoteService } from "@/components/entities/note/service";

export const useNoteManagement = () => {
  const [isEncrypted, setIsEncrypted] = useState(false);

  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewNote, setIsNewNote] = useState(false);

  const getNote = async (fileId: string) => {
    if (fileId === "new-note") {
      const tempNote = {
        content: "",
        label: "New Note",
        isEncrypted: false,
      };
      setNote(tempNote as Note);
      setIsNewNote(true);
      setIsEditing(true);
      setIsEncrypted(false);
      return;
    }

    try {
      const note = await NoteService.getByName(fileId);
      if (!note) return;

      setNote(note);
      setIsNewNote(false);
      setIsEditing(false);
      setIsEncrypted(note.isEncrypted);
      return note;
    } catch (err) {
      console.error("File not found:", fileId);
      return null;
    }
  };

  const saveNote = async (
    note: Note | null,
    editorContent: string,
    isEncrypted: boolean,
    password: string,
    encryptContent: (content: string, password: string) => string
  ) => {
    if (!note) return;

    if (isEncrypted) {
      note.content = encryptContent(editorContent, password);
    } else {
      note.content = editorContent;
    }

    if (isNewNote) {
      note.id = crypto.randomUUID();
      await NoteService.create(note);
      setIsNewNote(false);
    } else {
      await NoteService.update(note);
    }

    setNote({ ...note, content: editorContent });
    setIsEditing(false);
    return note;
  };

  const deleteNote = async (note: Note | null) => {
    if (!note) return;
    await NoteService.delete(note.id);
    setNote(null);
    window.history.pushState({}, "", `/`);
  };

  return {
    note,
    setNote,
    isEditing,
    setIsEditing,
    isNewNote,
    setIsNewNote,
    isEncrypted,
    setIsEncrypted,
    getNote,
    saveNote,
    deleteNote,
  };
};

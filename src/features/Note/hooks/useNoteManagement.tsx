import { useState } from "react";
import { noteService } from "@/entities/note/service";
import { Note } from "@/entities/note/types";
import { NoteEncryption } from "../lib/NoteEncryption";
import { useNoteStore } from "@/entities/note/api";

const defaultNote = { content: "", label: "New Note", isEncrypted: false };

export const useNoteManagement = () => {
  const [note, setNote] = useState<Note | null>(defaultNote as Note);
  const [isEditing, setIsEditing] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const { verifyPermission } = useNoteStore();

  const getNote = async (fileId: string) => {
    setNote(null);

    if (fileId === "new-note") {
      setNote(defaultNote as Note);
      setIsEditing(true);
      setIsEncrypted(false);
      return;
    }
    try {
      await verifyPermission();
      const note = await noteService.getByName(fileId);
      if (!note) return;

      setNote(note);
      setIsEditing(false);
      setIsEncrypted(note.isEncrypted);

      return note;
    } catch (e) {
      if ((e as DOMException).name === "NotFoundError") alert("Note not found");
    }
  };

  const saveNote = async (note: Note, password: string) => {
    const originalContent = note.content;

    if (note.isEncrypted) {
      note.content = await NoteEncryption.encrypt(note.content, password);
    }

    if (!note.id) {
      note.id = crypto.randomUUID();
      await noteService.create(note);
    } else {
      await noteService.update(note);
    }

    note.content = originalContent;
    setNote(note);
    setIsEditing(false);
    return note;
  };

  const deleteNote = async (note: Note | null) => {
    if (!note) return;
    await noteService.delete(note.id);
    setNote(defaultNote as Note);
  };

  return {
    note,
    setNote,
    isEditing,
    setIsEditing,
    isEncrypted,
    setIsEncrypted,
    getNote,
    saveNote,
    deleteNote,
  };
};

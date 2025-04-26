import { useState } from "react";
import { noteService } from "@/entities/note/service";
import { useModalActions } from "@/shared/hooks/useModalStore";
import {Note} from "@/entities/note/types";

export const useNoteManagement = () => {
  const [isEncrypted, setIsEncrypted] = useState(false);

  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewNote, setIsNewNote] = useState(false);

  const { openEnterPasswordModal } = useModalActions();

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

    const note = await noteService.getByName(fileId);
    if (!note) return;

    setNote(note);
    setIsNewNote(false);
    setIsEditing(false);
    setIsEncrypted(note.isEncrypted);
    if (note.isEncrypted) {
      openEnterPasswordModal();
    }

    return note;
  };

  const saveNote = async (
    note: Note | null,
    editorContent: string,
    isEncrypted: boolean,
    password: string,
    encryptContent: (
      content: string,
      password: string
    ) => Promise<string | null>
  ) => {
    if (!note) return;

    if (isEncrypted) {
      note.content = (await encryptContent(editorContent, password)) as string;
    } else {
      note.content = editorContent;
    }

    if (isNewNote) {
      note.id = crypto.randomUUID();
      await noteService.create(note);
      setIsNewNote(false);
    } else {
      await noteService.update(note);
    }

    setNote({ ...note, content: editorContent });
    setIsEditing(false);
    return note;
  };

  const deleteNote = async (note: Note | null) => {
    if (!note) return;
    await noteService.delete(note.id);
    setNote(null);
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

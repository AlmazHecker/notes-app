import { useRef, useState, useEffect } from "react";
import type { Note } from "@/lib/notesDB";
import { TextEditor } from "@/components/ui/text-editor/text-editor";
import { EditIcon, SaveIcon, Trash, Lock, Unlock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ExpandPane from "./ExpandPane";
import { NoteService } from "@/components/entities/note/service";
import { usePushStateListener } from "@/shared/hooks/usePushStateListener";
import { useNoteStore } from "@/components/entities/note/api";
import useDraggableLayout from "@/shared/hooks/useDraggableLayout";
import { EncryptionToggle } from "./EncryptionToggle";
import { PasswordModals } from "../Encryption/PasswordModals";

// Simple encryption/decryption functions
const encryptContent = (content: string, password: string) => {
  // In a real app, use a proper encryption library
  // This is a simple XOR for demonstration
  let encrypted = "";
  for (let i = 0; i < content.length; i++) {
    const charCode =
      content.charCodeAt(i) ^ password.charCodeAt(i % password.length);
    encrypted += String.fromCharCode(charCode);
  }
  return btoa(encrypted); // Base64 encode for storage
};

const decryptContent = (encryptedContent: string, password: string) => {
  try {
    const content = atob(encryptedContent); // Base64 decode
    let decrypted = "";
    for (let i = 0; i < content.length; i++) {
      const charCode =
        content.charCodeAt(i) ^ password.charCodeAt(i % password.length);
      decrypted += String.fromCharCode(charCode);
    }
    return decrypted;
  } catch (e) {
    return null; // Decryption failed
  }
};

export function CurrentNote() {
  const editorRef = useRef<Editor | null>(null);

  const getNotes = useNoteStore((state) => state.fetchNotes);

  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableLabel, setEditableLabel] = useState("");
  const [isNewNote, setIsNewNote] = useState(false);

  const [isEncrypted, setIsEncrypted] = useState(false);

  // Encryption-related states
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [showEnterPasswordModal, setShowEnterPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const setEditMode = () => {
    if (isEncrypted) {
      setShowEnterPasswordModal(true);
      return;
    }
    return setIsEditing(true);
  };

  const handleEncryptionToggle = () => {
    if (!note) return;

    if (note.isEncrypted) {
      handleDecryptNote();
    } else {
      setShowSetPasswordModal(true);
    }
  };

  const getNote = async (fileId: string) => {
    if (fileId === "new-note") {
      const tempNote = {
        content: "",
        label: "New Note",
        isEncrypted: false,
      };
      setNote(tempNote as Note);
      setEditableLabel(tempNote.label);
      setIsNewNote(true);
      setIsEditing(true);
      return;
    }

    try {
      const note = await NoteService.getByName(fileId);
      if (!note) return;

      setNote(note);
      setEditableLabel(note.label);
      setIsNewNote(false);
      setIsEditing(false);
      setIsEncrypted(note.isEncrypted);

      // If note is encrypted, we'll need to prompt for password
      if (note.isEncrypted) {
        setShowEnterPasswordModal(true);
      }
    } catch (err) {
      console.error("File not found:", fileId);
      return null;
    }
  };

  const saveNote = async () => {
    if (!note) return;

    let content = editorRef.current?.getHTML() as string;
    let updatedNote: Note = {
      ...note,
      label: editableLabel,
    };

    // If the note is encrypted, encrypt the content before saving
    if (note.isEncrypted) {
      updatedNote.content = encryptContent(content, password);
    } else {
      updatedNote.content = content;
    }

    if (isNewNote) {
      updatedNote.id = crypto.randomUUID();
      await NoteService.create(updatedNote);
      setIsNewNote(false);
    } else {
      await NoteService.update(updatedNote);
    }

    setNote(updatedNote);
    setIsEditing(false);
    window.history.pushState({}, "", `?noteId=${updatedNote.id}`);
    getNotes();
  };

  const deleteNote = async () => {
    if (isEncrypted) return setShowEnterPasswordModal(true);
    if (!note) return;

    await NoteService.delete(note.id);
    setNote(null);
    window.history.pushState({}, "", `/`);
    return getNotes();
  };

  const handleSetPassword = async () => {
    // Validate passwords
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }

    setPasswordError("");

    if (!note) return;

    // Get current content from editor if editing, otherwise use stored content
    const content = isEditing
      ? (editorRef.current?.getHTML() as string)
      : note.content;

    // Encrypt the content
    const encryptedContent = encryptContent(content, password);

    // Save the encrypted note
    const updatedNote: Note = {
      ...note,
      label: editableLabel,
      content: encryptedContent,
      isEncrypted: true,
    };
    if (isNewNote) updatedNote.id = crypto.randomUUID();

    await NoteService.update(updatedNote);
    setNote(updatedNote);
    setShowSetPasswordModal(false);
    setIsEncrypted(true);
    getNotes();
  };

  const handleEnterPassword = () => {
    if (!note || !note.isEncrypted) return;

    const decrypted = decryptContent(note.content, password);

    if (decrypted === null) {
      setPasswordError("Incorrect password");
      return;
    }

    setPasswordError("");
    setNote({ ...note, content: decrypted });
    setShowEnterPasswordModal(false);
    setIsEncrypted(false);

    if (isEditing) {
      setIsEditing(true);
    }
  };

  const handleDecryptNote = async () => {
    if (!note || !note.isEncrypted) return;

    const updatedNote: Note = {
      ...note,
      isEncrypted: false,
    };

    await NoteService.update(updatedNote);
    setNote(updatedNote);
    setPassword("");
    getNotes();
  };

  usePushStateListener(() => {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("noteId");

    if (noteId) getNote(noteId);
  });

  useDraggableLayout();

  if (!note) return <div className="p-4">Note not found or loading...</div>;

  const displayContent = isEncrypted
    ? "This note is encrypted. Click the lock icon to decrypt."
    : note.content;

  return (
    <div className="p-4 space-y-4 shadow">
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            className="text-2xl border-none font-bold border outline-none rounded p-0"
            value={editableLabel}
            onChange={(e) => setEditableLabel(e.target.value)}
            placeholder="Enter note title"
            autoFocus={isNewNote}
          />
        ) : (
          <h1 className="text-2xl font-bold">{note.label}</h1>
        )}

        <div className="flex gap-3 items-center">
          <EncryptionToggle
            isEncrypted={isEncrypted}
            isNoteEncrypted={note.isEncrypted}
            onEncryptionToggle={handleEncryptionToggle}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={isEditing ? saveNote : setEditMode}
              >
                {isEditing ? <SaveIcon /> : <EditIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isEditing ? "Save" : "Edit"}</TooltipContent>
          </Tooltip>

          {isNewNote || (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" onClick={deleteNote}>
                  <Trash />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{"Delete"}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <TextEditor
        className={
          isEditing
            ? "bg-input/70 rounded-md p-4 transition-all"
            : "transition-all"
        }
        ref={editorRef}
        value={displayContent}
        editable={isEditing && !isEncrypted}
      />

      {note && <ExpandPane />}

      <PasswordModals
        showSetPasswordModal={showSetPasswordModal}
        setShowSetPasswordModal={setShowSetPasswordModal}
        showEnterPasswordModal={showEnterPasswordModal}
        setShowEnterPasswordModal={setShowEnterPasswordModal}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
        onSetPassword={handleSetPassword}
        onEnterPassword={handleEnterPassword}
      />
    </div>
  );
}

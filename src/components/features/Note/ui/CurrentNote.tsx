import { useEffect, useRef } from "react";
import { TextEditor } from "@/components/ui/text-editor/text-editor";
import { EditIcon, SaveIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePushStateListener } from "@/shared/hooks/usePushStateListener";
import { useNoteStore } from "@/components/entities/note/api";
import useDraggableLayout from "@/shared/hooks/useDraggableLayout";
import { EncryptionToggle } from "./EncryptionToggle";
import ExpandPane from "./ExpandPane";
import { NoteService } from "@/components/entities/note/service";
import { Note } from "@/lib/notesDB";
import { useNoteEncryption } from "../hooks/useNoteEncryption";
import { useNoteManagement } from "../hooks/useNoteManagement";
import { SetPasswordModal } from "./SetPasswordModal";
import { EnterPasswordModal } from "./EnterPasswordModal";
import { useModalActions } from "@/shared/hooks/useModalStore";

export function CurrentNote() {
  const editorRef = useRef<Editor | null>(null);
  const getNotes = useNoteStore((state) => state.fetchNotes);

  const {
    openSetPasswordModal,
    closeSetPasswordModal,
    openEnterPasswordModal,
    closeEnterPasswordModal,
  } = useModalActions();

  const { password, setPassword, encryptContent, decryptContent } =
    useNoteEncryption();

  // Note management logic
  const {
    note,
    setNote,
    isEncrypted,
    setIsEncrypted,
    isEditing,
    setIsEditing,
    isNewNote,
    getNote: fetchNote,
    saveNote: saveNoteHandler,
    deleteNote: deleteNoteHandler,
  } = useNoteManagement();

  const setEditMode = () => {
    if (isEncrypted) {
      return openEnterPasswordModal();
    }
    return setIsEditing(true);
  };

  const handleEncryptionToggle = () => {
    if (!note) return;

    if (note.isEncrypted) {
      handleDecryptNote();
    } else {
      openSetPasswordModal();
    }
  };

  const saveNote = async () => {
    if (!note) return;
    const content = editorRef.current?.getHTML() as string;
    const updatedNote = await saveNoteHandler(
      note,
      content,
      note.isEncrypted,
      password,
      encryptContent
    );
    getNotes();
    if (isNewNote) {
      window.history.pushState({}, "", `?noteId=${updatedNote.id}`);
    }
  };

  const deleteNote = async () => {
    if (isEncrypted) return openEnterPasswordModal();
    await deleteNoteHandler(note);
    getNotes();
  };

  const handleSetPassword = async () => {
    if (!note) return;

    const content = isEditing
      ? (editorRef.current?.getHTML() as string)
      : note.content;

    const updatedNote: Note = {
      ...note,
      isEncrypted: true,
    };

    await saveNoteHandler(updatedNote, content, true, password, encryptContent);
    closeSetPasswordModal();
    getNotes();
  };

  const handleEnterPassword = (password: string) => {
    // this if else shouldn't exist...
    if (!note || !note.isEncrypted) return;

    const decrypted = decryptContent(note.content, password);

    if (decrypted === null) {
      return false;
    }

    setNote({ ...note, content: decrypted });
    setIsEncrypted(false);
    closeEnterPasswordModal();
    return true;
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

    if (noteId) fetchNote(noteId);
  });

  useDraggableLayout();
  useEffect(() => {
    if (isEncrypted) {
      openEnterPasswordModal();
    }
  }, [isEncrypted]);

  if (!note) return <div className="p-4">Note not found or loading...</div>;

  const displayContent = isEncrypted
    ? "This note is encrypted. Click the lock icon to decrypt."
    : note.content;

  return (
    <div className="p-4 space-y-4 shadow">
      <div className="flex items-center justify-between py-1">
        {isEditing ? (
          <input
            className="text-2xl border-none font-bold border outline-none rounded p-0"
            value={note.label}
            onChange={(e) => setNote({ ...note, label: e.target.value })}
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

      <SetPasswordModal onSuccess={handleSetPassword} />
      <EnterPasswordModal onSuccess={handleEnterPassword} />
    </div>
  );
}

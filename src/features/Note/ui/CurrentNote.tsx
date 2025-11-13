import { useEffect, useRef, useState } from "react";
import { TextEditor } from "@/shared/ui/text-editor/text-editor";
import { ArrowLeft, EditIcon, SaveIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { type Editor } from "@tiptap/react";
import { useNoteStore } from "@/entities/note/api";
import ExpandPane from "./ExpandPane";
import { useNoteManagement } from "../hooks/useNoteManagement";
import { SetPasswordModal } from "../../NoteEncryption/ui/SetPasswordModal";
import { EnterPasswordModal } from "../../NoteEncryption/ui/EnterPasswordModal";
import DraggableLayout from "@/features/Note/ui/DraggableLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NoteActionsDropdown } from "./NoteActionsDropdown";
import SearchInput from "./SearchInput";
import { Note } from "@/entities/note/types";
import { NoteEncryption } from "../lib/NoteEncryption";
import { PermissionDenied } from "@/shared/ui/permission-denied";
import { EncryptedContent } from "./EncryptedContent";

export const CurrentNote = () => {
  const editorRef = useRef<Editor | null>(null);
  const getNotes = useNoteStore((state) => state.fetchNotes);
  const [toggleSearch, setToggleSearch] = useState(false);

  const navigate = useNavigate();

  const [isSetPasswordModalOpen, openSetPasswordModal] = useState(false);
  const [isEnterPasswordModalOpen, openEnterPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  const {
    note,
    setNote,
    isEncrypted,
    setIsEncrypted,
    isEditing,
    setIsEditing,
    getNote,
    saveNote: saveNoteHandler,
    deleteNote: deleteNoteHandler,
  } = useNoteManagement();

  const setEditMode = () => {
    if (isEncrypted) {
      return openEnterPasswordModal(true);
    }
    return setIsEditing(true);
  };

  const handleEncryptionToggle = () => {
    if (note?.isEncrypted) {
      return handleDecryptNote();
    }
    return openSetPasswordModal(true);
  };

  const saveNote = async (note: Note, password: string) => {
    note.content = editorRef.current?.getHTML() || "";

    const updatedNote = await saveNoteHandler(note, password);
    setNote(updatedNote);
    setPassword(password);
    getNotes();
    navigate(`?noteId=${updatedNote?.id}`);
  };

  const deleteNote = async () => {
    if (
      note?.isEncrypted &&
      !confirm("This note is encrypted. Are you sure you want to delete it?")
    ) {
      return;
    }
    await deleteNoteHandler(note);

    navigate("/");
    getNotes();
  };

  const handleEncryptNote = async (password: string) => {
    const updatedNote: Note = { ...(note as Note), isEncrypted: true };
    saveNote(updatedNote, password);
  };

  const handleDecryptNote = async () => {
    const updatedNote = { ...(note as Note), isEncrypted: false };
    saveNote(updatedNote, "");
  };

  const handleEnterPassword = async (password: string) => {
    try {
      const decrypted = await NoteEncryption.decrypt(note?.content!, password);

      if (decrypted === null) {
        return false;
      }

      setNote({ ...(note as Note), content: decrypted });
      setIsEncrypted(false);
      setPassword(password);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const [params] = useSearchParams();
  const noteId = params.get("noteId");

  useEffect(() => {
    if (noteId) getNote(noteId);
  }, [noteId]);

  const { hasPermission } = useNoteStore();

  if (!hasPermission && noteId !== "new-note") {
    return (
      <PermissionDenied
        containerClassName="p-5"
        permissionTrigger={() => getNote(noteId!)}
      />
    );
  }

  if (!noteId || !note) {
    return (
      <div className="hidden md:flex items-center justify-center h-full text-muted-foreground">
        Select a note to view
      </div>
    );
  }
  return (
    <div className="relative flex-1 flex flex-col p-4 space-y-4 shadow h-full">
      {toggleSearch && (
        <SearchInput
          onClose={() => setToggleSearch(false)}
          editor={editorRef.current}
        />
      )}

      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-3 w-full">
          <Button
            onClick={handleBack}
            className="md:hidden flex"
            variant="outline"
            size="icon"
          >
            <ArrowLeft />
          </Button>
          {isEditing ? (
            <input
              className="w-full text-2xl border-none font-bold border outline-none rounded p-0"
              value={note.label}
              onChange={(e) => setNote({ ...note, label: e.target.value })}
              placeholder="Enter note title"
            />
          ) : (
            <h1 className="text-2xl font-bold">{note.label}</h1>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={isEditing ? () => saveNote(note, password) : setEditMode}
          >
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </Button>

          <NoteActionsDropdown
            isEncrypted={isEncrypted}
            note={note}
            onEncryptionClick={handleEncryptionToggle}
            onDeleteClick={deleteNote}
            onSearchClick={() => setToggleSearch(!toggleSearch)}
          />
        </div>
      </div>
      {isEncrypted ? (
        <EncryptedContent onDecrypt={() => openEnterPasswordModal(true)} />
      ) : (
        <TextEditor
          className={
            isEditing
              ? "bg-input/70 rounded-md p-4 transition-all"
              : "transition-all"
          }
          ref={editorRef}
          value={note.content}
          editable={isEditing}
        />
      )}

      {note && <ExpandPane />}

      {isSetPasswordModalOpen && (
        <SetPasswordModal
          onClose={() => openSetPasswordModal(false)}
          onSubmit={handleEncryptNote}
        />
      )}

      {isEnterPasswordModalOpen && (
        <EnterPasswordModal
          onClose={() => openEnterPasswordModal(false)}
          onSubmit={handleEnterPassword}
        />
      )}
      <DraggableLayout />
    </div>
  );
};

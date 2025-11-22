import { FC, useEffect, useRef, useState } from "react";
import { TextEditor } from "@/shared/ui/text-editor/text-editor";
import { ArrowLeft, SaveIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { type Editor } from "@tiptap/react";
import { useNoteStore } from "@/entities/note/api";
import ExpandPane from "./ExpandPane";
import { SetPasswordModal } from "../../NoteEncryption/ui/SetPasswordModal";
import { EnterPasswordModal } from "../../NoteEncryption/ui/EnterPasswordModal";
import DraggableLayout from "@/features/Note/ui/DraggableLayout";
import { useNavigate } from "react-router-dom";
import { NoteActionsDropdown } from "./NoteActionsDropdown";
import SearchInput from "./SearchInput";
import { Note } from "@/entities/note/types";
import { NoteEncryption } from "../lib/NoteEncryption";
import { EncryptedContent } from "./EncryptedContent";
import { noteService } from "@/entities/note/service";
import { useTranslation } from "react-i18next";

const getDefaultNote = () => ({
  content: "",
  label: "New Note",
  isEncrypted: false,
  id: crypto.randomUUID(),
});

type CurrentNoteProps = {
  noteId: string;
};
export const CurrentNote: FC<CurrentNoteProps> = ({ noteId }) => {
  const editorRef = useRef<Editor | null>(null);
  const [toggleSearch, setToggleSearch] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [modal, setModal] = useState<"enter" | "set" | "">("");
  const [password, setPassword] = useState("");

  const [note, setNote] = useState<Note | null>(getDefaultNote() as Note);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const noteStore = useNoteStore();

  const handleEncryptionToggle = () => {
    if (note?.isEncrypted) {
      return handleDecryptNote();
    }
    return setModal("set");
  };

  const saveNote = async (note: Note, password: string) => {
    note.content = editorRef.current?.getHTML() || "";
    const originalContent = note.content;

    if (note.isEncrypted) {
      note.content = await NoteEncryption.encrypt(note.content, password);
    }

    await noteService.update(note);

    note.content = originalContent;
    setNote(note);
    setPassword(password);
    noteStore.getNotes();
    navigate(`?noteId=${note?.id}`);
  };

  const deleteNote = async () => {
    if (!note || (note.isEncrypted && !confirm(t("note.deleteNoteConfirm")))) {
      return;
    }
    await noteService.delete(note.id);

    navigate("/");
    noteStore.getNotes();
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
    const decrypted = await NoteEncryption.decrypt(note?.content!, password);

    setNote({ ...(note as Note), content: decrypted });
    setIsEncrypted(false);
    setPassword(password);
  };

  const getNote = async (noteId: string) => {
    setNote(null);

    if (noteId === "new-note") {
      setNote(getDefaultNote() as Note);
      setIsEncrypted(false);
      return;
    }
    const note = await noteStore.getNote(noteId);
    if (!note) return;

    setNote(note);
    setIsEncrypted(note.isEncrypted);
  };

  useEffect(() => {
    if (noteId) getNote(noteId);
    return () => setNote(null);
  }, [noteId]);

  if (!note)
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Note not found
      </div>
    );

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
            onClick={() => navigate("/")}
            className="md:hidden flex"
            variant="outline"
            size="icon"
          >
            <ArrowLeft />
          </Button>
          <input
            className="w-full text-2xl border-none font-bold border outline-none rounded p-0"
            value={note.label}
            onChange={(e) => setNote({ ...note, label: e.target.value })}
            placeholder="Enter note title"
            readOnly={isEncrypted}
          />
        </div>

        <div className="flex gap-3 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => saveNote(note, password)}
          >
            <SaveIcon />
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
        <EncryptedContent onDecrypt={() => setModal("enter")} />
      ) : (
        <TextEditor
          className="transition-all"
          ref={editorRef}
          value={note.content}
          editable={!isEncrypted}
        />
      )}

      <ExpandPane />

      {modal === "set" && (
        <SetPasswordModal
          onClose={() => setModal("")}
          onSubmit={handleEncryptNote}
        />
      )}

      {modal === "enter" && (
        <EnterPasswordModal
          onClose={() => setModal("")}
          onSubmit={handleEnterPassword}
        />
      )}
      <DraggableLayout />
    </div>
  );
};

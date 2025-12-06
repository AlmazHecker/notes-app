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
import { MenuBar } from "@/shared/ui/text-editor/MenuBar";

const getDefaultNote = () =>
  ({
    content: "",
    label: "New Note",
    isEncrypted: false,
    id: crypto.randomUUID(),
  }) as Note;

type CurrentNoteProps = {
  noteId: string;
};
export const CurrentNote: FC<CurrentNoteProps> = ({ noteId }) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [toggleSearch, setToggleSearch] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [modal, setModal] = useState<"enter" | "set" | "">("");
  const [password, setPassword] = useState("");

  const [note, setNote] = useState<Note | null>(getDefaultNote());
  const [isEncrypted, setIsEncrypted] = useState(false);
  const noteStore = useNoteStore();

  const handleEncryptionToggle = () => {
    if (note?.isEncrypted) {
      return handleDecryptNote();
    }
    return setModal("set");
  };

  const saveNote = async (note: Note, password: string) => {
    const copy = { ...note };
    copy.content = editor?.getHTML() || "";

    if (note.isEncrypted) {
      copy.content = await NoteEncryption.encrypt(copy.content, password);
    }

    await noteService.update(copy);
    alert("Note Updated!");

    setPassword(password);
    noteStore.getNotes();
    navigate(`?noteId=${note?.id}`, { replace: true });
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
    // for mobile smooth experience
    if (window.innerWidth <= 768) {
      setNote(null);
    }

    let note: Note | void = getDefaultNote();

    if (noteId !== "new-note") {
      note = await noteStore.getNote(noteId);
    }
    if (!note) return;

    setNote(note);
    setIsEncrypted(note.isEncrypted);
  };

  useEffect(() => {
    if (noteId) getNote(noteId);
  }, [noteId]);

  if (!note)
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Note not found
      </div>
    );

  return (
    <div className="relative flex-1 flex flex-col pt-0 shadow ">
      {toggleSearch && (
        <SearchInput onClose={() => setToggleSearch(false)} editor={editor} />
      )}

      <div className="sticky top-0 pt-4 bg-background z-30 pb-4 md:pb-0">
        <div className="px-4 flex items-center justify-between">
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

        <MenuBar editor={editor} />
      </div>
      {isEncrypted ? (
        <EncryptedContent onDecrypt={() => setModal("enter")} />
      ) : (
        <TextEditor
          ref={setEditor}
          value={note.content}
          editable={!isEncrypted}
        />
      )}

      <ExpandPane />

      <SetPasswordModal
        isOpen={modal === "set"}
        onClose={() => setModal("")}
        onSubmit={handleEncryptNote}
      />
      <EnterPasswordModal
        isOpen={modal === "enter"}
        onClose={() => setModal("")}
        onSubmit={handleEnterPassword}
      />
      <DraggableLayout />
    </div>
  );
};

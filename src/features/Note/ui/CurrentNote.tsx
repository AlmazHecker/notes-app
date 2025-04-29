import { useEffect, useRef, useState } from "react";
import { TextEditor } from "@/shared/ui/text-editor/text-editor";
import { ArrowLeft, EditIcon, Folder, SaveIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { type Editor } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { useNoteStore } from "@/entities/note/api";
import ExpandPane from "./ExpandPane";
import { noteService } from "@/entities/note/service";
import { useNoteEncryption } from "../hooks/useNoteEncryption";
import { useNoteManagement } from "../hooks/useNoteManagement";
import { SetPasswordModal } from "../../NoteEncryption/ui/SetPasswordModal";
import { EnterPasswordModal } from "../../NoteEncryption/ui/EnterPasswordModal";
import { useModalActions } from "@/shared/hooks/useModalStore";
import DraggableLayout, {
  LAYOUT_SELECTORS,
} from "@/features/Note/ui/DraggableLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NoteActionsDropdown } from "./NoteActionsDropdown";
import SearchInput from "./SearchInput";
import { useTranslation } from "react-i18next";
import { Note } from "@/entities/note/types";

export const CurrentNote = () => {
  const { t } = useTranslation();

  const editorRef = useRef<Editor | null>(null);
  const getNotes = useNoteStore((state) => state.fetchNotes);
  const [toggleSearch, setToggleSearch] = useState(false);

  const navigate = useNavigate();

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
      navigate(`?noteId=${updatedNote?.id}`);
    }
  };

  const deleteNote = async () => {
    if (isEncrypted) return openEnterPasswordModal();
    await deleteNoteHandler(note);

    navigate("/");
    getNotes();
  };

  const handleSetPassword = async () => {
    if (!note) return;

    const content = isEditing
      ? (editorRef.current?.getHTML() as string)
      : note.content;

    const updatedNote: Note = { ...note, isEncrypted: true };

    await saveNoteHandler(updatedNote, content, true, password, encryptContent);
    closeSetPasswordModal();
    getNotes();
  };

  const handleEnterPassword = async (password: string) => {
    // this if else shouldn't exist...
    if (!note || !note.isEncrypted) return false;

    const decrypted = await decryptContent(note.content, password);

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

    const updatedNote: Note = { ...note, isEncrypted: false };

    await noteService.update(updatedNote);
    setNote(updatedNote);
    setPassword("");
    getNotes();
  };

  const [params] = useSearchParams();
  const noteId = params.get("noteId");

  const getNote = async () => {
    try {
      setNote(null);
      if (noteId) {
        setPassword("");
        await fetchNote(noteId);
      }
    } catch (e) {
      navigate("/");
    }
  };

  useEffect(() => {
    getNote();
  }, [noteId]);

  const goToNotes = () => {
    return navigate("/");
  };

  if (!note) return null;

  const displayContent = isEncrypted ? t("note.encrypted") : note.content;

  return (
    <div
      id={LAYOUT_SELECTORS.right}
      className="relative flex-1 flex flex-col md:h-full overflow-y-auto h-full p-4 space-y-4 shadow"
    >
      {toggleSearch && (
        <SearchInput
          onClose={() => setToggleSearch(false)}
          editor={editorRef.current}
        />
      )}

      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-3 w-full">
          <Button
            onClick={goToNotes}
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
              autoFocus={isNewNote}
            />
          ) : (
            <h1 className="text-2xl font-bold">{note.label}</h1>
          )}
        </div>

        <div className="flex gap-3 items-center">
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
            <TooltipContent>
              {isEditing ? t("common.save") : t("common.edit")}
            </TooltipContent>
          </Tooltip>

          <NoteActionsDropdown
            isNew={isNewNote}
            isEncrypted={isEncrypted}
            note={note}
            onEncryptionClick={handleEncryptionToggle}
            onDeleteClick={deleteNote}
            onSearchClick={() => setToggleSearch(!toggleSearch)}
          />
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

      <DraggableLayout />
    </div>
  );
};

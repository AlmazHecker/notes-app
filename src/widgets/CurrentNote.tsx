import { FC, useEffect, useRef, useState } from "react";
import {
  EDITOR_EXTENSIONS,
  TextEditor,
} from "@/shared/ui/text-editor/text-editor";
import { useEditor } from "@tiptap/react";
import { useNoteStore } from "@/entities/note/api";
import ExpandPane from "../features/Note/ui/ExpandPane";
import { SetPasswordModal } from "../features/NoteEncryption/ui/SetPasswordModal";
import { EnterPasswordModal } from "../features/NoteEncryption/ui/EnterPasswordModal";
import DraggableLayout from "@/features/Note/ui/DraggableLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Note, NoteMeta } from "@/entities/note/types";
import { NoteEncryption } from "../features/Note/lib/NoteEncryption";
import { EncryptedContent } from "../features/Note/ui/EncryptedContent";
import { noteService } from "@/entities/note/service";
import { useTranslation } from "react-i18next";
import { MenuBar } from "@/shared/ui/text-editor/MenuBar";
import { getEscapedHtml } from "@/shared/lib/utils";
import { Title } from "../features/Note/ui/Title";
import { Header } from "../features/Note/ui/Header";

const getDefaultNote = () =>
  ({
    label: "New note",
    isEncrypted: false,
    id: crypto.randomUUID(),
  }) as NoteMeta;

export const CurrentNote = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const noteId = params.get("noteId") as string;

  const [modal, setModal] = useState<"enter" | "set" | "">("");
  const passwordRef = useRef("");

  const noteRef = useRef<NoteMeta>(null);

  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editor = useEditor(
    { extensions: EDITOR_EXTENSIONS, editable: !isEncrypted },
    [],
  );

  const toggleEncryption = () => {
    if (noteRef.current?.isEncrypted) {
      return decryptNote();
    }
    return setModal("set");
  };

  const saveNote = async () => {
    if (!noteRef.current) return;

    const copy: Note = { ...noteRef.current, content: new Uint8Array() };
    const noteContent = editor?.getHTML() || "";

    setIsSaving(true);
    const password = passwordRef.current;

    if (noteRef.current.isEncrypted) {
      copy.content = await NoteEncryption.encrypt(noteContent, password);
    } else {
      copy.snippet =
        getEscapedHtml(noteContent.slice(0, 100)) +
        (noteContent.length > 100 ? "..." : "");
      copy.content = new TextEncoder().encode(noteContent);
    }

    await noteService.update(copy);

    setLastSaved(new Date());
    useNoteStore.getState().getNotes();
    navigate(`?noteId=${noteRef.current.id}`, { replace: true });
    setIsSaving(false);
  };

  const deleteNote = async () => {
    if (!confirm(t("note.deleteNoteConfirm"))) return;
    await noteService.delete(noteRef.current?.id!);
    navigate({ search: "" });
    useNoteStore.getState().getNotes();
  };

  const encryptNote = async (password: string) => {
    if (!noteRef.current) return;
    passwordRef.current = password;
    noteRef.current.isEncrypted = true;

    await saveNote();
  };

  const decryptNote = async () => {
    if (!noteRef.current) return;
    noteRef.current.isEncrypted = false;
    passwordRef.current = "";

    await saveNote();
  };

  const checkPassword = async (password: string) => {
    const noteContent = await noteService.getContent(noteId);

    const decrypted = await NoteEncryption.decrypt(noteContent, password);
    editor!.commands.setContent(decrypted);
    setIsEncrypted(false);
    passwordRef.current = password;
  };
  const getNote = async (noteId: string) => {
    if (window.innerWidth <= 768 && !noteId) {
      setTimeout(() => (noteRef.current = null), 300); // 300 - to sync with slide in animation duration
      return;
    }
    setIsLoadingContent(true);
    try {
      let note: NoteMeta = getDefaultNote();

      if (noteId && noteId !== "new-note") {
        note = await noteService.getMeta(noteId);
        if (!note.isEncrypted) {
          const noteContent = await noteService.getContent(noteId);
          editor?.commands.setContent(new TextDecoder().decode(noteContent));
        }
      }

      if (!note) return;

      noteRef.current = note;
      setIsEncrypted(note.isEncrypted);
    } finally {
      setIsLoadingContent(false);
    }
  };

  useEffect(() => {
    getNote(noteId);
  }, [noteId]);

  if (isLoadingContent)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-primary border-muted" />
        <p className="mt-2 text-muted-foreground">{t("common.loading")}</p>
      </div>
    );

  if (!noteRef.current)
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Note not found
      </div>
    );

  return (
    <div className="relative flex-1 flex flex-col pt-0 shadow ">
      <div className="sticky top-0 pt-4 bg-background z-30 pb-4 md:pb-0">
        <Header
          deleteNote={deleteNote}
          saveNote={saveNote}
          toggleEncryption={toggleEncryption}
          note={noteRef.current}
          isSaving={isSaving}
          lastSaved={lastSaved}
          editor={editor}
          isEncrypted={isEncrypted}
        />

        <Title
          isEncrypted={isEncrypted}
          title={noteRef.current.label}
          setTitle={(e) => {
            if (!noteRef.current) return;
            noteRef.current.label = e.target.value;
          }}
        />

        <MenuBar editor={editor} />
      </div>
      {isEncrypted ? (
        <EncryptedContent onDecrypt={() => setModal("enter")} />
      ) : (
        <TextEditor editor={editor} />
      )}

      <ExpandPane />

      <SetPasswordModal
        isOpen={modal === "set"}
        onClose={() => setModal("")}
        onSubmit={encryptNote}
      />
      <EnterPasswordModal
        isOpen={modal === "enter"}
        onClose={() => setModal("")}
        onSubmit={checkPassword}
      />
      <DraggableLayout />
    </div>
  );
};

import { useEditor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEntryStore } from "@/entities/entry/api";
import { entryService } from "@/entities/entry/service";
import type { Note, NoteEntry } from "@/entities/note/types";
import DraggableLayout from "@/features/draggable-layout/ui/draggable-layout";
import {
  decrypt,
  encrypt,
} from "@/features/note-encryption/lib/note-encryption";
import { getEscapedHtml } from "@/shared/lib/utils";
import { MenuBar } from "@/shared/ui/text-editor/menu-bar";
import {
  EDITOR_EXTENSIONS,
  TextEditor,
} from "@/shared/ui/text-editor/text-editor";
import ExpandPane from "../features/draggable-layout/ui/expand-pane";
import { EnterPasswordModal } from "../features/note-encryption/ui/enter-password-modal";
import { SetPasswordModal } from "../features/note-encryption/ui/set-password-modal";
import { Header } from "../features/view-note/ui/note-header";
import { Title } from "../features/view-note/ui/note-title";
import { EncryptedContent } from "../shared/ui/encrypted-content";

const getDefaultNote = () =>
  ({
    label: "New note",
    isEncrypted: false,
    id: crypto.randomUUID(),
  }) as NoteEntry;

export const CurrentNote = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const noteId = params.get("noteId") as string;

  const [modal, setModal] = useState<"enter" | "set" | "">("");
  const passwordRef = useRef("");

  const [note, setNote] = useState<NoteEntry | null>(getDefaultNote());

  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editor = useEditor(
    { extensions: EDITOR_EXTENSIONS, editable: !isEncrypted },
    [],
  );

  const toggleEncryption = () => {
    if (note?.isEncrypted) {
      return decryptNote();
    }
    return setModal("set");
  };

  const saveNote = async () => {
    if (!note) return;

    const copy: Note = { ...note, content: new Uint8Array() };
    const noteContent = editor?.getHTML() || "";

    setIsSaving(true);
    const password = passwordRef.current;

    if (note.isEncrypted) {
      copy.content = await encrypt(noteContent, password);
    } else {
      copy.snippet =
        getEscapedHtml(noteContent.slice(0, 100)) +
        (noteContent.length > 100 ? "..." : "");
      copy.content = new TextEncoder().encode(noteContent);
    }

    await entryService.update(copy);

    setLastSaved(new Date());
    useEntryStore.getState().getEntries();
    navigate(`?noteId=${note.id}`, { replace: true });
    setIsSaving(false);
  };

  const deleteNote = async () => {
    if (!confirm(t("note.deleteNoteConfirm"))) return;
    await entryService.delete(note!.id);
    navigate({ search: "" });
    useEntryStore.getState().getEntries();
  };

  const encryptNote = async (password: string) => {
    if (!note) return;
    passwordRef.current = password;
    note.isEncrypted = true;

    await saveNote();
  };

  const decryptNote = async () => {
    if (!note) return;
    note.isEncrypted = false;
    passwordRef.current = "";

    await saveNote();
  };

  const checkPassword = async (password: string) => {
    const noteContent = await entryService.getContent(noteId);

    const decrypted = await decrypt(noteContent, password);
    editor!.commands.setContent(decrypted);
    setIsEncrypted(false);
    passwordRef.current = password;
  };

  const getNote = async (noteId: string) => {
    if (window.innerWidth <= 768 && !noteId) {
      setTimeout(() => setNote(getDefaultNote()), 300); // 300 - to sync with slide in animation duration
      return;
    }
    setIsLoadingContent(true);
    try {
      let note: NoteEntry = getDefaultNote();

      if (noteId && noteId !== "new-note") {
        note = (await entryService.getMeta(noteId)) as NoteEntry;
        if (!note.isEncrypted) {
          const noteContent = await entryService.getContent(noteId);
          editor?.commands.setContent(new TextDecoder().decode(noteContent));
        }
      }

      if (!note) return;

      setNote(note);
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

  if (!note)
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
          note={note}
          isSaving={isSaving}
          lastSaved={lastSaved}
          editor={editor}
          isEncrypted={isEncrypted}
        />

        <Title
          isEncrypted={isEncrypted}
          value={note.label}
          setValue={(e) => {
            if (!note) return;
            note.label = e.target.value;
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

import { useRef, useState } from "react";
import type { Note } from "@/lib/notesDB";
import { TextEditor } from "@/components/ui/text-editor/text-editor";
import { EditIcon, SaveIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ExpandPane from "./ExpandPane";
import { NoteService } from "@/components/entities/note/api";
import { usePushStateListener } from "@/shared/hooks/usePushStateListener";

export function CurrentNote() {
  const editorRef = useRef<Editor | null>(null);

  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableLabel, setEditableLabel] = useState("");
  const [isNewNote, setIsNewNote] = useState(false);

  const setEditMode = () => {
    return setIsEditing(true);
  };

  const getNote = async (fileId: string) => {
    if (fileId === "new-note") {
      // Create a temporary new note
      const tempNote = {
        content: "",
        label: "New Note",
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
    } catch (err) {
      console.error("File not found:", fileId);
      return null;
    }
  };

  const saveNote = async () => {
    if (!note) return;

    const updatedNote: Note = {
      ...note,
      content: editorRef.current?.getHTML() as string,
      label: editableLabel,
    };

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
  };

  const deleteNote = async () => {
    if (!note) return;

    await NoteService.delete(note.id);
    window.location.href = "/";
  };

  usePushStateListener(() => {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("noteId");

    if (noteId) getNote(noteId);
  });

  if (!note) return <div className="p-4">Note not found or loading...</div>;

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
        value={note.content}
        editable={isEditing}
      />

      {note && <ExpandPane />}
    </div>
  );
}

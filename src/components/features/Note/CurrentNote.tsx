import { useEffect, useRef, useState } from "react";
import type { Note } from "@/lib/notesDB";
import { getFolderHandle } from "@/lib/fileApi";
import { TextEditor } from "@/components/ui/text-editor/text-editor";
import { EditIcon, Expand, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CurrentNote() {
  const editorRef = useRef<Editor | null>(null);

  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableLabel, setEditableLabel] = useState("");

  const setEditMode = () => {
    editorRef.current?.setEditable(true);
    setIsEditing(true);
  };

  const getFileByName = async (filename: string) => {
    try {
      const folderHandle = await getFolderHandle();
      const fileHandle = await folderHandle.getFileHandle(filename);
      const file = await fileHandle.getFile();
      const content = await file.text();
      setNote({ content, label: filename });
      setEditableLabel(filename);
      return content;
    } catch (err) {
      console.error("File not found:", filename);
      return null;
    }
  };

  const saveNote = async () => {
    if (!note) return;

    const folderHandle = await getFolderHandle();

    const newFileHandle = await folderHandle.getFileHandle(editableLabel, {
      create: true,
    });
    const writable = await newFileHandle.createWritable();
    await writable.write(editorRef.current?.getHTML() as string);
    await writable.close();

    if (editableLabel !== note.label) {
      try {
        await folderHandle.removeEntry(note.label);
      } catch (err) {
        console.error("Failed to remove old file:", err);
      }
    }

    setNote({ ...note, label: editableLabel });
    setIsEditing(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("noteId");

    if (noteId) {
      getFileByName(noteId);
    }
  }, []);

  if (!note) return <div className="p-4">Note not found or loading...</div>;

  return (
    <div className="p-4 space-y-4 shadow relative">
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            className="text-2xl border-none font-bold border outline-none rounded p-0"
            value={editableLabel}
            onChange={(e) => setEditableLabel(e.target.value)}
          />
        ) : (
          <h1 className="text-2xl font-bold">{note.label}</h1>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={isEditing ? saveNote : () => setEditMode()}
            >
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isEditing ? "Save" : "Edit"}</TooltipContent>
        </Tooltip>
      </div>
      <TextEditor ref={editorRef} value={note.content} editable={isEditing} />

      <Button
        className="absolute bottom-5 right-5 z-10"
        variant="outline"
        size="icon"
      >
        <Expand />
      </Button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { type Note } from "@/lib/notesDB";
import { getFolderHandle, verifyPermission } from "@/lib/fileApi";
import { Button } from "@/components/ui/button";
import { EyeIcon, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/components/ui/link";
import { NoteService } from "@/components/entities/note/api";

export function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);

  const loadNotesFromFolder = async () => {
    const notes = await NoteService.getAll();
    setNotes(notes);
  };

  const init = async () => {
    setIsLoading(true);
    setHasPermission(true);

    try {
      const handle = await getFolderHandle();
      if (!(await verifyPermission(handle))) {
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      await loadNotesFromFolder();
    } catch (err) {
      console.error("Error loading folder:", err);
      setHasPermission(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const sharedContent = (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Saved Notes</h2>
      {hasPermission ? (
        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="?noteId=new-note" size="icon" variant="outline">
                <Plus />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Add new note</TooltipContent>
          </Tooltip>
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline">
                <EyeIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View hidden notes</TooltipContent>
          </Tooltip> */}
        </div>
      ) : (
        <Button onClick={init}>Select folder</Button>
      )}
    </div>
  );

  if (!hasPermission) {
    return (
      <div className="p-4 space-y-4">
        {sharedContent}
        <p className="text-red-500">
          Permission denied or folder not set. Please reselect the folder.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {sharedContent}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-gray-900 border-gray-300" />
        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!notes.length) {
    return (
      <div className="space-y-4 p-4">
        {sharedContent}
        <p className="text-muted-foreground">No notes saved yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {sharedContent}
      <div className="grid gap-4">
        {notes.map((note, i) => (
          <a
            key={i}
            className="p-4 rounded-md border"
            href={`?noteId=${note.label}`}
          >
            <h3 className="font-semibold">{note.label}</h3>
            <p
              className="text-sm text-muted-foreground line-clamp-1"
              dangerouslySetInnerHTML={{ __html: note.content }}
            ></p>
          </a>
        ))}
      </div>
    </div>
  );
}

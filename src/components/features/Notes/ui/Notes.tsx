import { useEffect, useState } from "react";
import { getFolderHandle, verifyPermission } from "@/lib/fileApi";
import { Button } from "@/components/ui/button";
import { EyeIcon, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/components/ui/link";
import { useNoteStore } from "@/components/entities/note/api";
import { NoteList } from "./NoteList";

export const Notes = () => {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const notes = useNoteStore((state) => state.notes);
  const getNotes = useNoteStore((state) => state.fetchNotes);

  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);

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
      await getNotes();
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
              <Link href="/?noteId=new-note" size="icon" variant="outline">
                <Plus />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Add new note</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                <EyeIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View hidden notes</TooltipContent>
          </Tooltip>
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
        <NoteList notes={notes} />
      </div>
    </div>
  );
};

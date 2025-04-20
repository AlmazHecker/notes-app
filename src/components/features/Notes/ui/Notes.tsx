import { useEffect, useState } from "react";
import { getFolderHandle, verifyPermission } from "@/lib/fileApi";
import { Button } from "@/components/ui/button";
import { Plus, SearchIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/components/ui/link";
import { useNoteStore } from "@/components/entities/note/api";
import { NoteList } from "./NoteList";
import { LAYOUT_SELECTORS } from "@/components/features/Note/ui/DraggableLayout";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { SearchNotesModal } from "../../SearchNotes/ui/SearchNotesModal";
import { useSearchParams } from "react-router-dom";

export const Notes = () => {
  const notes = useNoteStore((state) => state.notes);
  const getNotes = useNoteStore((state) => state.fetchNotes);

  const [params] = useSearchParams();
  const noteId = params.get("noteId");

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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

  const containerClassName = `md:overflow-auto md:w-1/2 min-w-[200px] md:max-w-[80%] md:h-screen space-y-4 p-4 ${noteId && isMobile && "hidden"}`;

  const sharedContent = (
    <div className="flex justify-between items-center sticky top-0 md:-top-4 py-1 bg-background z-10 ">
      <h2 className="text-xl font-bold">Saved Notes</h2>
      {hasPermission ? (
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <SearchIcon />
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/?noteId=new-note" size="icon" variant="outline">
                <Plus />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Add new note</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <Button onClick={init}>Select folder</Button>
      )}
    </div>
  );

  if (!hasPermission) {
    return (
      <div className={containerClassName} id={LAYOUT_SELECTORS.left}>
        {sharedContent}
        <p className="text-red-500">
          Permission denied or folder not set. Please reselect the folder.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={containerClassName} id={LAYOUT_SELECTORS.left}>
        {sharedContent}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-gray-900 border-gray-300" />
        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!notes.length) {
    return (
      <div className={containerClassName} id={LAYOUT_SELECTORS.left}>
        {sharedContent}
        <p className="text-muted-foreground">No notes saved yet.</p>
      </div>
    );
  }

  return (
    <div className={containerClassName} id={LAYOUT_SELECTORS.left}>
      {sharedContent}
      <div className="grid gap-4">
        <NoteList notes={notes} />
      </div>

      {isSearchModalOpen && (
        <SearchNotesModal
          open={isSearchModalOpen}
          setOpen={setIsSearchModalOpen}
        />
      )}
    </div>
  );
};

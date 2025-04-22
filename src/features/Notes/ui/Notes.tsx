import { useEffect, useState } from "react";
import { getFolderHandle, verifyPermission } from "@/lib/fileApi";
import { Button } from "@/shared/ui/button";
import { Plus, SearchIcon, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { Link } from "@/shared/ui/link";
import { useNoteStore } from "@/entities/note/api";
import { NoteList } from "./NoteList";
import { LAYOUT_SELECTORS } from "@/features/Note/ui/DraggableLayout";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { SearchNotesModal } from "../../SearchNotes/ui/SearchNotesModal";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Notes = () => {
  const { t } = useTranslation();

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
      <h2 className="text-xl font-bold">{t("notes.title")}</h2>
      {hasPermission ? (
        <div className="flex items-center gap-3">
          <Link size="icon" variant="outline" to="/settings">
            <Settings />
          </Link>
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
            <TooltipContent>{t("notes.addNote")}</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <Button onClick={init}>{t("notes.openFolder")}</Button>
      )}
    </div>
  );

  if (!hasPermission) {
    return (
      <div className={containerClassName} id={LAYOUT_SELECTORS.left}>
        {sharedContent}
        <p className="text-red-500">{t("fileApi.permissionDenied")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={containerClassName} id={LAYOUT_SELECTORS.left}>
        {sharedContent}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-gray-900 border-gray-300" />
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  if (!notes.length) {
    return (
      <div className={containerClassName} id={LAYOUT_SELECTORS.left}>
        {sharedContent}
        <p className="text-muted-foreground">{t("notes.empty")}</p>
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

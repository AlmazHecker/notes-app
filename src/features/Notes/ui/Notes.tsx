import { useEffect, useState } from "react";
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

  const notesStore = useNoteStore();

  const [params] = useSearchParams();
  const noteId = params.get("noteId");

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const init = async () => {
    await notesStore.verifyPermission();
    await notesStore.fetchNotes();
  };

  useEffect(() => {
    init();
  }, []);

  const containerClassName = `md:overflow-auto md:w-1/2 min-w-[200px] md:max-w-[80%] md:h-full space-y-4 p-4 ${noteId && isMobile && "hidden"}`;

  const sharedContent = (
    <div className="flex justify-between items-center sticky top-0 md:-top-4 py-1 bg-background z-10 ">
      <h2 className="text-xl font-bold">{t("notes.title")}</h2>
      {notesStore.hasPermission ? (
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

  const renderContent = () => {
    if (!notesStore.hasPermission) {
      return (
        <>
          <p className="text-red-500">{t("fileApi.permissionDenied")}</p>
          <p>
            If this is your first time setting a folder, create an empty one and
            select it. Otherwise, choose an existing folder where your notes are
            saved
          </p>
        </>
      );
    }

    if (notesStore.isLoading) {
      return (
        <>
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-gray-900 border-gray-300" />
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t("common.loading")}
          </p>
        </>
      );
    }

    if (!notesStore.notes.length) {
      return <p className="text-muted-foreground">{t("notes.empty")}</p>;
    }

    return (
      <div className="grid gap-4">
        <NoteList notes={notesStore.notes} />
      </div>
    );
  };

  return (
    <div className={containerClassName} id={LAYOUT_SELECTORS.left}>
      {sharedContent}
      {renderContent()}

      <SearchNotesModal
        open={isSearchModalOpen}
        setOpen={setIsSearchModalOpen}
      />
    </div>
  );
};

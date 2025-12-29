import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Plus, SearchIcon, Settings } from "lucide-react";
import { Link } from "@/shared/ui/link";
import { useNoteStore } from "@/entities/note/api";
import { NoteList } from "./NoteList";
import { SearchNotesModal } from "../../SearchNotes/ui/SearchNotesModal";
import { useTranslation } from "react-i18next";

export const Notes = () => {
  const { t } = useTranslation();
  const notesStore = useNoteStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const getNotes = async () => {
    try {
      setIsLoading(true);
      await notesStore.getNotes();
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getNotes();
  }, []);

  const sharedContent = (
    <div className="flex justify-between items-center sticky py-4 mb-0 top-0 bg-background z-10 ">
      <h2 className="text-xl font-bold">{t("notes.title")}</h2>
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
        <Link to="?noteId=new-note" size="icon" variant="outline">
          <Plus />
        </Link>
      </div>
    </div>
  );

  const renderContent = () => {
    // if (!notesStore.hasPermission) {
    //   return <PermissionDenied permissionTrigger={notesStore.getNotes} />;
    // }

    if (isLoading) {
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
    <>
      {sharedContent}
      {renderContent()}

      <SearchNotesModal
        open={isSearchModalOpen}
        setOpen={setIsSearchModalOpen}
      />
    </>
  );
};

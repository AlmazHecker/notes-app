import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Plus,
  SearchIcon,
  Settings,
  ArrowLeft,
  FolderPlus,
} from "lucide-react";
import { Link } from "@/shared/ui/link";
import { useNoteStore } from "@/entities/note/api";
import { NoteList } from "../features/note-list/ui/note-list";
import { SearchNotesModal } from "../features/search-notes/ui/search-notes-modal";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export const Notes = () => {
  const { t } = useTranslation();
  const notesStore = useNoteStore();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const getNotes = async () => {
    try {
      setIsLoading(true);
      const folderIds = location.pathname.split("/").filter(Boolean);
      await notesStore.setPath(folderIds);
      await notesStore.getNotes();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, [location.pathname]);

  const handleCdInto = async (id: string) => {
    notesStore.pathIds.push(id);
    navigate("/" + notesStore.pathIds.join("/"));
  };

  const handleGoBack = async () => {
    notesStore.pathIds.pop();
    navigate("/" + notesStore.pathIds.join("/"));
  };

  const handleCreateFolder = async () => {
    const label = prompt(t("notes.newFolder"));
    if (label) {
      await notesStore.createFolder(label);
    }
  };

  const sharedContent = (
    <div className="flex flex-col sticky top-0 bg-background z-10">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          {notesStore.pathIds.length > 0 && (
            <Button size="icon" variant="outline" onClick={handleGoBack}>
              <ArrowLeft />
            </Button>
          )}
          <h2 className="text-lg md:text-xl font-bold">
            {notesStore.dir ? notesStore.dir : t("notes.title")}
          </h2>
        </div>
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
          <Button size="icon" variant="outline" onClick={handleCreateFolder}>
            <FolderPlus />
          </Button>
          <Link to="?noteId=new-note" size="icon" variant="outline">
            <Plus />
          </Link>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-primary border-muted" />
          <p className="mt-2 text-muted-foreground">{t("common.loading")}</p>
        </div>
      );
    }

    if (!notesStore.notes.length) {
      return <p className="text-muted-foreground">{t("notes.empty")}</p>;
    }

    return (
      <div className="grid gap-4">
        <NoteList notes={notesStore.notes} onCdInto={handleCdInto} />
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
        onCdInto={handleCdInto}
      />

      <Link
        to="?noteId=new-note"
        className="w-14 h-14 fixed bottom-6 right-6 md:hidden z-50 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 border border-primary-foreground/10"
        size="icon"
      >
        <Plus className="size-8" />
      </Link>
    </>
  );
};

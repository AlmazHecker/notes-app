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
import { NoteList } from "./NoteList";
import { SearchNotesModal } from "../../SearchNotes/ui/SearchNotesModal";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export const Notes = () => {
  const { t } = useTranslation();
  const notesStore = useNoteStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  // const folderPath = params["*"]?.split("/").filter(Boolean) || [];
  // console.log(params);

  const getNotes = async () => {
    try {
      setIsLoading(true);
      // if (folderPath.length > 0 && notesStore.pathIds.length === 0) {
      //   await notesStore.setPath(folderPath);
      // } else {
      await notesStore.getNotes();
      // }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const updatePathParams = (newPathIds: string[]) => {
    const noteId = searchParams.get("noteId");
    const path = newPathIds.length > 0 ? `/${newPathIds.join("/")}` : "/";
    const query = noteId ? `?noteId=${noteId}` : "";
    navigate(`${path}${query}`);
  };

  const handleCdInto = async (id: string) => {
    await notesStore.cdInto(id);
    updatePathParams(notesStore.pathIds);
  };

  const handleGoBack = async () => {
    await notesStore.goBack();
    updatePathParams(notesStore.pathIds);
  };

  const handleCreateFolder = async () => {
    const label = prompt(t("notes.newFolder"));
    if (label) {
      await notesStore.createFolder(label);
    }
  };

  const sharedContent = (
    <div className="flex flex-col sticky top-0 bg-background z-10 pb-4">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          {notesStore.path.length > 0 && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleGoBack}
              className="mr-2"
            >
              <ArrowLeft />
            </Button>
          )}
          <h2 className="text-xl font-bold">
            {notesStore.path.length > 0
              ? notesStore.path[notesStore.path.length - 1]
              : t("notes.title")}
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
      {notesStore.path.length > 0 && (
        <div className="text-xs text-muted-foreground flex items-center gap-1 overflow-x-auto whitespace-nowrap animate-in fade-in slide-in-from-top-1 duration-300">
          <span>{t("notes.notes")}</span>
          {notesStore.path.map((p, i) => (
            <span key={i} className="flex items-center gap-1">
              <span>/</span>
              <span>{p}</span>
            </span>
          ))}
        </div>
      )}
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
      />
    </>
  );
};

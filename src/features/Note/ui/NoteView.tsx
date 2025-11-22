import { useNoteStore } from "@/entities/note/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PermissionDenied } from "@/shared/ui/permission-denied";
import { CurrentNote } from "./CurrentNote";
import { useLaunchQueue } from "../hooks/useLaunchQueue";

export const NoteView = () => {
  const noteStore = useNoteStore();
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const noteId = params.get("noteId") as string;

  useLaunchQueue((launchedNote) => {
    navigate(`?noteId=${launchedNote.id}`);
  });

  if (!noteStore.hasPermission && noteId !== "new-note") {
    return (
      <PermissionDenied
        containerClassName="p-5"
        permissionTrigger={() => noteStore.getNote(noteId)}
      />
    );
  }

  if (!noteId) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a note to view
      </div>
    );
  }

  return <CurrentNote noteId={noteId} />;
};

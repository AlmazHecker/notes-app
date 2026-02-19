import { useSearchParams } from "react-router-dom";
import { CurrentNote } from "./CurrentNote";

export const NoteView = () => {
  const [params] = useSearchParams();
  const noteId = params.get("noteId") as string;

  return <CurrentNote noteId={noteId} />;
};

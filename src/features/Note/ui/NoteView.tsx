import { useSearchParams } from "react-router-dom";
import { CurrentNote } from "./CurrentNote";

export const NoteView = () => {
  const [params] = useSearchParams();
  const noteId = params.get("noteId") as string;

  // if (!noteStore.hasPermission) {
  //   return (
  //     <PermissionDenied
  //       containerClassName="p-5"
  //       permissionTrigger={() => noteStore.getNote(noteId)}
  //     />
  //   );
  // }

  return <CurrentNote noteId={noteId} />;
};

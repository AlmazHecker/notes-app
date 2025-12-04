import { LAYOUT_SELECTORS } from "@/features/Note/ui/DraggableLayout";
import { NoteView } from "@/features/Note/ui/NoteView";
import { Notes } from "@/features/Notes/ui/Notes";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get("noteId");
  const isNoteOpen = !!noteId;

  return (
    <div className="flex flex-1 md:h-full md:max-h-full shadow overflow-hidden">
      <div
        className={`
          flex w-full md:w-auto md:flex-1
          transition-transform duration-300 ease-in-out
          ${isNoteOpen ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
        `}
      >
        <div
          id={LAYOUT_SELECTORS.left}
          className="
            w-full md:w-1/2
            flex-shrink-0
            md:overflow-auto min-w-[250px] md:max-w-[80%] md:h-full
            space-y-4 p-4
          "
        >
          <Notes />
        </div>

        <div
          id={LAYOUT_SELECTORS.divider}
          className="transition duration-300 md:block hidden w-1 bg-border cursor-col-resize flex-shrink-0"
        ></div>

        <div
          className="
            w-full md:w-auto md:flex-1
            flex-shrink-0
            h-full overflow-y-auto
          "
          id={LAYOUT_SELECTORS.right}
        >
          <NoteView />
        </div>
      </div>
    </div>
  );
};

export default Index;

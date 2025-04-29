import { CurrentNote } from "@/features/Note/ui/CurrentNote";
import { LAYOUT_SELECTORS } from "@/features/Note/ui/DraggableLayout";
import { Notes } from "@/features/Notes/ui/Notes";
import React from "react";

type IndexProps = {};

const Index: React.FC<IndexProps> = (props) => {
  return (
    <div className="md:flex md:h-full md:max-h-full shadow">
      <Notes />

      <div
        id={LAYOUT_SELECTORS.divider}
        className="transition duration-300 md:block hidden w-1 dark:bg-border cursor-col-resize"
      ></div>
      <CurrentNote />
    </div>
  );
};

export default Index;

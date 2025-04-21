import { CurrentNote } from "@/features/Note/ui/CurrentNote";
import { LAYOUT_SELECTORS } from "@/features/Note/ui/DraggableLayout";
import { Notes } from "@/features/Notes/ui/Notes";
import React from "react";

type IndexProps = {};

const Index: React.FC<IndexProps> = (props) => {
  return (
    <div className="md:flex md:h-screen md:max-h-screen shadow select-none">
      <Notes />

      <div
        id={LAYOUT_SELECTORS.divider}
        className="md:block hidden w-1 bg-gray-300 dark:bg-border cursor-col-resize"
      ></div>
      <CurrentNote />
    </div>
  );
};

export default Index;

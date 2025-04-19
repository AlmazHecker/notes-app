import React from "react";
import ReactDOM from "react-dom/client";
import { CurrentNote } from "./components/features/Note/ui/CurrentNote";
import { LAYOUT_SELECTORS } from "./shared/hooks/useDraggableLayout";
import { Notes } from "./components/features/Notes/ui/Notes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div className="flex h-screen shadow select-none">
      <div
        id={LAYOUT_SELECTORS.left}
        className="overflow-auto w-1/2 min-w-[200px] max-w-[80%]"
      >
        <Notes />
      </div>

      <div
        id={LAYOUT_SELECTORS.divider}
        className="w-1 bg-gray-300 dark:bg-border cursor-col-resize"
      ></div>

      <div id={LAYOUT_SELECTORS.right} className="flex-1">
        <CurrentNote />
      </div>
    </div>
  </React.StrictMode>
);

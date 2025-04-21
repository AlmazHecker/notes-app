import React from "react";
import ReactDOM from "react-dom/client";
import { CurrentNote } from "@/features/Note/ui/CurrentNote";
import { LAYOUT_SELECTORS } from "@/features/Note/ui/DraggableLayout";
import { Notes } from "@/features/Notes/ui/Notes";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="md:flex md:h-screen md:max-h-screen shadow select-none">
        <Notes />

        <div
          id={LAYOUT_SELECTORS.divider}
          className="md:block hidden w-1 bg-gray-300 dark:bg-border cursor-col-resize"
        ></div>
        <CurrentNote />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);

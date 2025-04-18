import React from "react";
import ReactDOM from "react-dom/client";
import { NoteList } from "./components/features/Note/NoteList";
import { CurrentNote } from "./components/features/Note/CurrentNote";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div className="dark flex h-screen shadow select-none">
      <div
        id="noteList"
        className="overflow-auto w-1/2 min-w-[200px] max-w-[80%]"
      >
        <NoteList />
      </div>

      <div
        id="divider"
        className="w-1 bg-gray-300 dark:bg-border cursor-col-resize"
      ></div>

      <div id="currentNote" className="overflow-auto flex-1">
        <CurrentNote />
      </div>
    </div>
  </React.StrictMode>
);

import React, { FC, useState, useEffect, useRef } from "react";
import { Editor, Range } from "@tiptap/react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

type SearchInputProps = {
  editor: Editor | null;
  onClose?: () => void;
};

const SearchInput: FC<SearchInputProps> = ({ editor, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [resultsInfo, setResultsInfo] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const updateSearchReplace = (search: string, clearIndex: boolean = false) => {
    if (!editor) return;

    if (clearIndex) editor.commands.resetIndex();

    editor.commands.setSearchTerm(search);
    editor.commands.setCaseSensitive(false);

    goToSelection();
    updateResultsInfo();
  };

  const updateResultsInfo = () => {
    if (!editor) return;

    const { results, resultIndex } = editor.storage.searchAndReplace;
    const count = results.length;

    if (count > 0) {
      setResultsInfo(`${resultIndex + 1} of ${count}`);
    } else {
      setResultsInfo("No results");
    }
  };

  const goToSelection = () => {
    if (!editor) return;

    const { results, resultIndex } = editor.storage.searchAndReplace;
    const position: Range = results[resultIndex];

    if (!position) return;

    editor.commands.setTextSelection(position as Range);

    const { node } = editor.view.domAtPos(editor.state.selection.anchor);

    setTimeout(() => {
      if (node instanceof HTMLElement) {
        node.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  };

  const handleNextResult = () => {
    if (!editor) return;
    editor.commands.nextSearchResult();
    goToSelection();
    updateResultsInfo();
  };

  const handlePrevResult = () => {
    if (!editor) return;
    editor.commands.previousSearchResult();
    goToSelection();
    updateResultsInfo();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateSearchReplace(value, true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setResultsInfo("");
    if (editor) {
      editor.commands.setSearchTerm("");
    }
  };

  const handleCloseClick = () => {
    onClose();
    editor.commands.resetIndex();
    editor.commands.setSearchTerm("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="sticky z-10 top-0 mx-auto left-0 right-0 rounded-lg shadow-md bg-white dark:bg-gray-800 p-2 w-full max-w-md">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <Input
            ref={inputRef}
            className="pl-10 pr-10 py-2 w-full rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search in note..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                handlePrevResult();
              } else if (e.key === "Enter") {
                handleNextResult();
              }
            }}
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          onClick={handleCloseClick}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close search"
        >
          <X size={20} />
        </button>
      </div>

      {searchTerm && (
        <div className="flex items-center justify-between mt-2 px-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {resultsInfo}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrevResult}
              className="p-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            >
              Previous
            </button>
            <button
              onClick={handleNextResult}
              className="p-1 text-sm bg-blue-500 rounded hover:bg-blue-600 text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;

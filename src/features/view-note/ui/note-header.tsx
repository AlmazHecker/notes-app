import type { Editor } from "@tiptap/react";
import { ArrowLeft, Check, SaveIcon } from "lucide-react";
import type { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { NoteEntry } from "@/entities/entry/types";
import { Button } from "@/shared/ui/button";
import SearchInput from "@/shared/ui/text-editor/search-input";
import { NoteActionsDropdown } from "./note-actions-dropdown";

type Props = {
  saveNote: () => void;
  deleteNote: () => void;
  toggleEncryption: () => void;
  note: NoteEntry;
  isEncrypted: boolean;

  lastSaved: Date | null;
  isSaving: boolean;

  editor: Editor;
};

export const Header: FC<Props> = ({
  deleteNote,
  saveNote,
  toggleEncryption,
  isEncrypted,
  editor,
  isSaving,
  lastSaved,
  note,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isSearchOpen = searchParams.get("search") === "true";
  const isDropdownOpen = searchParams.get("dropdown") === "true";

  const toggleSearch = () => {
    searchParams.set("search", isSearchOpen ? "false" : "true");
    setSearchParams(searchParams, { replace: true });
  };
  const toggleDropdown = () => {
    searchParams.set("dropdown", isDropdownOpen ? "false" : "true");
    setSearchParams(searchParams, { replace: true });
  };

  const formatLastSaved = () => {
    if (!lastSaved) return "";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diff < 60) return "Saved just now";
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
    return `Saved at ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };
  return (
    <>
      {isSearchOpen && <SearchInput onClose={toggleSearch} editor={editor} />}
      <div className="px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 w-full">
          <Button
            onClick={() => navigate({ search: "" })}
            className="md:hidden flex"
            variant="outline"
            size="icon"
          >
            <ArrowLeft />
          </Button>

          <div className="text-xs text-muted-foreground flex items-center gap-1">
            {isSaving ? (
              <span className="animate-pulse">Saving...</span>
            ) : lastSaved ? (
              <>
                <Check className="w-3 h-3" />
                <span>{formatLastSaved()}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {note.label && (
            <Button variant="outline" size="icon" onClick={() => saveNote()}>
              <SaveIcon />
            </Button>
          )}

          <NoteActionsDropdown
            isEncrypted={isEncrypted}
            note={note}
            onEncryptionClick={toggleEncryption}
            onDeleteClick={deleteNote}
            onSearchClick={toggleSearch}
            onDropdownClick={toggleDropdown}
            isOpen={isDropdownOpen}
          />
        </div>
      </div>
    </>
  );
};

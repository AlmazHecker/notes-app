import { Button } from "@/shared/ui/button";
import { ArrowLeft, Check, SaveIcon } from "lucide-react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import { NoteActionsDropdown } from "./NoteActionsDropdown";
import { NoteMeta } from "@/entities/note/types";
import { Editor } from "@tiptap/react";

type Props = {
  saveNote: () => void;
  deleteNote: () => void;
  toggleEncryption: () => void;
  note: NoteMeta;
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
  const [toggleSearch, setToggleSearch] = useState(false);

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
      {toggleSearch && (
        <SearchInput onClose={() => setToggleSearch(false)} editor={editor} />
      )}
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
            onSearchClick={() => setToggleSearch(!toggleSearch)}
          />
        </div>
      </div>
    </>
  );
};

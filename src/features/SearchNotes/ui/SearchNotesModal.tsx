import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";
import { useNoteStore } from "@/entities/note/api";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { formatDate, getEscapedHtml } from "@/lib/utils";

type SearchNotesModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SearchNotesModal: FC<SearchNotesModalProps> = ({
  open,
  setOpen,
}) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { notes, fetchNotes } = useNoteStore();

  useEffect(() => {
    if (open) {
      fetchNotes();
    }
  }, [open, fetchNotes]);

  const handleSelectNote = (noteId: string) => {
    navigate(`?noteId=${noteId}`);
    setOpen(false);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search notes..."
          className="flex-1 h-12  bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No notes found.</CommandEmpty>
          <CommandGroup heading="Notes">
            {notes.map((note) => (
              <CommandItem
                key={note.id}
                onSelect={() => handleSelectNote(note.id)}
                className="cursor-pointer"
              >
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{note.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                  {!note.isEncrypted && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {getEscapedHtml(note.content)}
                      {note.content.length > 100 ? "..." : ""}
                    </p>
                  )}
                  {note.isEncrypted && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Encrypted note
                    </p>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

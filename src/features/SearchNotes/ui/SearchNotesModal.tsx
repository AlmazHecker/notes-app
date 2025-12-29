import { useEffect, FC } from "react";
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
import { formatDate } from "@/shared/lib/utils";
import { useTranslation } from "react-i18next";

type SearchNotesModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SearchNotesModal: FC<SearchNotesModalProps> = ({
  open,
  setOpen,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { notes, getNotes } = useNoteStore();

  useEffect(() => {
    if (open) getNotes();
  }, [open]);

  const handleSelectNote = (noteId: string) => {
    navigate(`?noteId=${noteId}`);
    setOpen(false);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={t("notes.searchNotes")}
          className="flex-1 h-12  bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <CommandList>
          <CommandEmpty>{t("notes.notFound")}</CommandEmpty>
          <CommandGroup heading={t("notes.notes")}>
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
                  {note.isEncrypted ? (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {t("notes.encrypted")}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {note.snippet}
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

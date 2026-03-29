import { useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";
import { useEntryStore } from "@/entities/entry/api";
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
import { Entry } from "@/entities/entry/types";

type SearchNotesModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCdInto: (folderId: string) => void;
};

export const SearchNotesModal: FC<SearchNotesModalProps> = ({
  open,
  setOpen,
  onCdInto,
}) => {
  const { t } = useTranslation();
  const { entries, getEntries } = useEntryStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) getEntries();
  }, [open]);

  const handleSelectNote = async (entry: Entry) => {
    if (entry.type === "folder") {
      onCdInto(entry.id);
    } else {
      navigate(`?noteId=${entry.id}`);
    }
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
            {entries.map((note) => (
              <CommandItem
                key={note.id}
                onSelect={() => handleSelectNote(note)}
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
                      {note.type === "file" && note.snippet}
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

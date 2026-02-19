import { useVirtualizer } from "@tanstack/react-virtual";
import { LockIcon, FolderIcon } from "lucide-react";
import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NoteMeta } from "@/entities/note/types";
import { useNoteStore } from "@/entities/note/api";

type NoteListProps = {
  notes: NoteMeta[];
  onCdInto: (folderId: string) => void;
};

export const NoteList: FC<NoteListProps> = ({ notes, onCdInto }) => {
  const { t } = useTranslation();
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: notes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="overflow-auto">
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          position: "relative",
        }}
        className="relative"
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const note = notes[virtualRow.index];

          if (note.type === "folder") {
            return (
              <button
                key={virtualRow.index}
                onClick={() => onCdInto(note.id)}
                className="absolute w-full p-4 rounded-md border text-left cursor-pointer hover:bg-accent transition-colors"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  top: 0,
                }}
              >
                <div className="flex items-center gap-2">
                  <FolderIcon size="18px" className="text-primary" />
                  <h3 className="font-semibold">{note.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {t("notes.folder")}
                </p>
              </button>
            );
          }

          return (
            <Link
              to={`?noteId=${note.id}`}
              key={virtualRow.index}
              className="absolute w-full p-4 rounded-md border hover:bg-accent transition-colors"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                top: 0,
              }}
            >
              <div className="flex items-center gap-1">
                <h3 className="font-semibold">{note.label}</h3>
                {note.isEncrypted && <LockIcon size="10px" />}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {note.isEncrypted ? t("notes.encrypted") : <>{note.snippet}</>}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

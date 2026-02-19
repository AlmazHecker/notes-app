import { useVirtualizer } from "@tanstack/react-virtual";
import { LockIcon, FolderIcon, Trash2, MoreVertical } from "lucide-react";
import { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NoteMeta } from "@/entities/note/types";
import { useNoteStore } from "@/entities/note/api";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type NoteListProps = {
  notes: NoteMeta[];
  onCdInto: (folderId: string) => void;
};

export const NoteList: FC<NoteListProps> = ({ notes, onCdInto }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentRef = useRef(null);
  const { moveNote, deleteEntry } = useNoteStore();
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: notes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm(t("note.deleteNoteConfirm"))) {
      await deleteEntry(id);
    }
  };

  const handleNoteClick = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("noteId", id);
    navigate(`?${params.toString()}`);
  };

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

          const actions = (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => handleDelete(e, note.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>{t("note.deleteNote")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );

          if (note.type === "folder") {
            const isDragOver = dragOverId === note.id;

            return (
              <div
                key={virtualRow.index}
                onClick={() => onCdInto(note.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverId(note.id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setDragOverId(null);
                  const noteId = e.dataTransfer.getData("noteId");
                  if (noteId && noteId !== note.id) {
                    await moveNote(noteId, note.id);
                  }
                }}
                className={cn(
                  "absolute w-full p-4 rounded-md border text-left cursor-pointer transition-colors group flex items-center justify-between",
                  isDragOver ? "bg-accent border-primary" : "hover:bg-accent",
                )}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  top: 0,
                }}
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FolderIcon size="18px" className="text-primary" />
                    <h3 className="font-semibold truncate">{note.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {t("notes.folder")}
                  </p>
                </div>
                {actions}
              </div>
            );
          }

          return (
            <div
              key={virtualRow.index}
              draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData("noteId", note.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={() => handleNoteClick(note.id)}
              className="absolute w-full p-4 rounded-md border hover:bg-accent transition-colors group cursor-pointer flex items-center justify-between"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                top: 0,
              }}
            >
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold truncate">{note.label}</h3>
                  {note.isEncrypted && <LockIcon size="10px" />}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {note.isEncrypted ? (
                    t("notes.encrypted")
                  ) : (
                    <>{note.snippet}</>
                  )}
                </p>
              </div>
              {actions}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { Note } from "@/lib/notesDB";
import { useVirtualizer } from "@tanstack/react-virtual";
import { LockIcon } from "lucide-react";
import { FC, useRef } from "react";

type NoteListProps = {
  notes: Note[];
};
export const NoteList: FC<NoteListProps> = ({ notes }) => {
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

          return (
            <div
              key={virtualRow.index}
              className="absolute w-full p-4 rounded-md border"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                top: 0,
              }}
              onClick={() =>
                window.history.pushState({}, "", `?noteId=${note.id}`)
              }
            >
              <div className="flex items-center gap-1">
                <h3 className="font-semibold">{note.label}</h3>
                {note.isEncrypted && <LockIcon size="10px" />}
              </div>
              <p
                className="text-sm text-muted-foreground line-clamp-1"
                dangerouslySetInnerHTML={{
                  __html: note.isEncrypted
                    ? "This note is encrypted."
                    : note.content,
                }}
              ></p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { Note } from "@/lib/notesDB";
import { FC } from "react";
import { EncryptionToggle } from "./EncryptionToggle";

type NoteHeaderProps = {
  isEditing: boolean;
  isNewNote: boolean;
  isEncrypted: boolean;
  note: Note;
  setNote: (note: Note) => void;

  onEncryptionToggle: () => void;
};

const NoteHeader: FC<NoteHeaderProps> = ({
  isEditing,
  isNewNote,
  isEncrypted,
  note,
  setNote,
}) => {
  return (
    <div className="flex items-center justify-between py-1">
      {isEditing ? (
        <input
          className="text-2xl border-none font-bold border outline-none rounded p-0"
          value={note.label}
          onChange={(e) => setNote({ ...note, label: e.target.value })}
          placeholder="Enter note title"
          autoFocus={isNewNote}
        />
      ) : (
        <h1 className="text-2xl font-bold">{note.label}</h1>
      )}

      <div className="flex gap-3 items-center">
        <EncryptionToggle
          isEncrypted={isEncrypted}
          isNoteEncrypted={note.isEncrypted}
          onEncryptionToggle={handleEncryptionToggle}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={isEditing ? saveNote : setEditMode}
            >
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isEditing ? "Save" : "Edit"}</TooltipContent>
        </Tooltip>

        {isNewNote || (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="icon" onClick={deleteNote}>
                <Trash />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{"Delete"}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default NoteHeader;

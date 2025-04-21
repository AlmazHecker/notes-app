import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lock, MenuIcon, Search, Trash, Unlock } from "lucide-react";
import { Note } from "@/lib/notesDB";
import { FC } from "react";

type NoteActionsDropdownProps = {
  isNew: boolean;
  isEncrypted: boolean;
  note: Note;
  onEncryptionClick: () => void;
  onDeleteClick: () => void;
  onSearchClick: () => void;
};
export const NoteActionsDropdown: FC<NoteActionsDropdownProps> = ({
  isNew,
  isEncrypted,
  note,
  onEncryptionClick,
  onDeleteClick,
  onSearchClick,
}) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Note Preferences</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={isEncrypted} onClick={onEncryptionClick}>
            {note.isEncrypted ? <Lock className="text-blue-500" /> : <Unlock />}
            <span>{note.isEncrypted ? "Decrypt Note" : "Encrypt Note"}</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onSearchClick}>
            <Search />
            <span>Search</span>
          </DropdownMenuItem>

          {isNew || (
            <DropdownMenuItem variant="destructive" onClick={onDeleteClick}>
              <Trash />
              <span>Delete Note</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

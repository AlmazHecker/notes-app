import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Lock, MenuIcon, Search, Trash, Unlock } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import {Note} from "@/entities/note/types";

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
  const { t } = useTranslation();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("note.title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={isEncrypted} onClick={onEncryptionClick}>
            {note.isEncrypted ? <Lock className="text-blue-500" /> : <Unlock />}
            <span>
              {note.isEncrypted ? t("note.decryptNote") : t("note.encryptNote")}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onSearchClick}>
            <Search />
            <span>{t("common.search")}</span>
          </DropdownMenuItem>

          {isNew || (
            <DropdownMenuItem variant="destructive" onClick={onDeleteClick}>
              <Trash />
              <span>{t("note.deleteNote")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

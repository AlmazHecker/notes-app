import { Lock, MenuIcon, Search, Trash, Unlock } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { NoteEntry } from "@/entities/entry/types";
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

type NoteActionsDropdownProps = {
  isEncrypted: boolean;
  note: NoteEntry;
  onEncryptionClick: () => void;
  onDeleteClick: () => void;
  onSearchClick: () => void;
  onDropdownClick: (open: boolean) => void;
  isOpen: boolean;
};
export const NoteActionsDropdown: FC<NoteActionsDropdownProps> = ({
  isEncrypted,
  note,
  onEncryptionClick,
  onDeleteClick,
  onSearchClick,
  onDropdownClick,
  isOpen,
}) => {
  const { t } = useTranslation();

  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={onDropdownClick}>
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
            {note.isEncrypted ? <Lock className="text-info" /> : <Unlock />}
            {note.isEncrypted ? t("note.decryptNote") : t("note.encryptNote")}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onSearchClick}>
            <Search />
            {t("common.search")}
          </DropdownMenuItem>

          {note?.label && (
            <DropdownMenuItem variant="destructive" onClick={onDeleteClick}>
              <Trash />
              {t("note.deleteNote")}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

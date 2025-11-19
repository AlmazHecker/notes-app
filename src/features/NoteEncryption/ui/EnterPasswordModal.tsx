import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";

import { useTranslation } from "react-i18next";

type EnterPasswordModalProps = {
  onSubmit: (password: string) => Promise<boolean>;
  onClose: () => void;
};

export const EnterPasswordModal = ({
  onSubmit,
  onClose,
}: EnterPasswordModalProps) => {
  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async () => {
    setPasswordError("");
    const isPasswordValid = await onSubmit(password);
    if (!isPasswordValid) {
      return setPasswordError(t("encryption.enterNotePassword.wrongPassword"));
    }
    onClose();
  };

  const handleClose = () => {
    setPassword("");
    setPasswordError("");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("encryption.enterNotePassword.title")}</DialogTitle>
          <DialogDescription>
            {t("encryption.enterNotePassword.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="enterPassword" className="text-right">
              {t("common.password")}
            </Label>
            <Input
              id="enterPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm text-center">{passwordError}</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {t("encryption.enterNotePassword.unlockNote")}
          </Button>
          <Button variant="outline" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

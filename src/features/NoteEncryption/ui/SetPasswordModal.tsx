import { useState, useEffect, FormEvent } from "react";
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

type SetPasswordModalProps = {
  onSubmit: (password: string) => Promise<void>;
  onClose: () => void;
};

export const SetPasswordModal = ({
  onSubmit,
  onClose,
}: SetPasswordModalProps) => {
  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (password.length > 0 && password.length < 12) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError(t("encryption.setNotePassword.validation.noMatch"));
      return;
    }

    if (password.length < 4) {
      setPasswordError(t("encryption.setNotePassword.validation.minLimit"));
      return;
    }

    if (password.length < 12) {
      const isConfirmed = confirm(
        t("encryption.setNotePassword.validation.minLimitWarning")
      );
      if (!isConfirmed) return;
    }

    await onSubmit(password);
    onClose();
  };

  const handleCancel = () => {
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("encryption.setNotePassword.title")}</DialogTitle>
          <DialogDescription>
            {t("encryption.setNotePassword.description")}
          </DialogDescription>
        </DialogHeader>
        <form
          id="set-password-form"
          className="grid gap-4 py-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note-password" className="text-right">
              {t("common.password")}
            </Label>
            <Input
              autoComplete="new-password"
              id="note-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">
              {t("encryption.setNotePassword.confirmPassword")}
            </Label>
            <Input
              autoComplete="new-password"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3"
            />
          </div>

          {showWarning && (
            <p className="text-yellow-600 text-sm">
              {t("encryption.setNotePassword.validation.minLimitMessage")}
            </p>
          )}

          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </form>
        <DialogFooter>
          <Button form="set-password-form" type="submit">
            {t("note.encryptNote")}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

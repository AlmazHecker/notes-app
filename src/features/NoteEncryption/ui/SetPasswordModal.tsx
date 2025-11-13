import { useState, useEffect } from "react";
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
// import {
//   useModalActions,
//   useSetPasswordModalOpen,
// } from "@/shared/hooks/useModalStore";
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
  // const isOpen = useSetPasswordModalOpen();
  // const { closeSetPasswordModal } = useModalActions();

  useEffect(() => {
    if (password.length > 0 && password.length < 12) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [password]);

  const handleSubmit = async () => {
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              {t("common.password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-right">
              {t("encryption.setNotePassword.confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit}>{t("note.encryptNote")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

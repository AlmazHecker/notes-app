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
import {
  useModalActions,
  useSetPasswordModalOpen,
} from "@/shared/hooks/useModalStore";
import { usePasswordStore } from "../../Note/hooks/usePasswordStore";

type SetPasswordModalProps = {
  onSuccess: (password: string) => void;
};

export const SetPasswordModal = ({ onSuccess }: SetPasswordModalProps) => {
  const passwordStore = usePasswordStore();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const isOpen = useSetPasswordModalOpen();
  const { closeSetPasswordModal } = useModalActions();

  useEffect(() => {
    if (
      passwordStore.password.length > 0 &&
      passwordStore.password.length < 12
    ) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [passwordStore.password]);

  const handleSubmit = () => {
    setPasswordError("");

    if (passwordStore.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (passwordStore.password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }

    if (passwordStore.password.length < 12) {
      const isConfirmed = confirm(
        "Warning: Your password is weak and may be easily cracked. Continue anyway?"
      );
      if (!isConfirmed) return;
    }

    onSuccess(passwordStore.password);
  };

  const handleCancel = () => {
    passwordStore.setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    closeSetPasswordModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeSetPasswordModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Encryption Password</DialogTitle>
          <DialogDescription>
            Set a password to encrypt this note. You'll need this password to
            view or edit the note in the future.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={passwordStore.password}
              onChange={(e) => passwordStore.setPassword(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-right">
              Confirm
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
              ⚠️ For better security, use at least 12 characters
            </p>
          )}

          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Encrypt Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

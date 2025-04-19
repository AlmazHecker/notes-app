import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useModalActions,
  useSetPasswordModalOpen,
} from "@/shared/hooks/useModalStore";
import { usePasswordStore } from "../hooks/usePasswordStore";

type SetPasswordModalProps = {
  onSuccess: (password: string) => void;
};

export const SetPasswordModal = ({ onSuccess }: SetPasswordModalProps) => {
  const passwordStore = usePasswordStore();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const isOpen = useSetPasswordModalOpen();
  const { closeSetPasswordModal } = useModalActions();

  const handleSubmit = () => {
    if (passwordStore.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (passwordStore.password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }

    setPasswordError("");
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
          {passwordError && (
            <p className="text-red-500 text-sm text-center">{passwordError}</p>
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

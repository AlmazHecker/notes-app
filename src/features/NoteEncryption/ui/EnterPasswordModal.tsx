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
import {
  useEnterPasswordModalOpen,
  useModalActions,
} from "@/shared/hooks/useModalStore";
import { usePasswordStore } from "../../Note/hooks/usePasswordStore";

type EnterPasswordModalProps = {
  onSuccess: (password: string) => Promise<boolean>;
};

export const EnterPasswordModal = ({ onSuccess }: EnterPasswordModalProps) => {
  const passwordStore = usePasswordStore();
  const [passwordError, setPasswordError] = useState("");
  const isOpen = useEnterPasswordModalOpen();
  const { closeEnterPasswordModal } = useModalActions();

  const handleSubmit = async () => {
    setPasswordError("");
    const isPasswordValid = await onSuccess(passwordStore.password);
    if (!isPasswordValid) {
      return setPasswordError("WRONG PASSWORD!");
    }
  };

  const handleClose = () => {
    passwordStore.setPassword("");
    setPasswordError("");
    closeEnterPasswordModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeEnterPasswordModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Password</DialogTitle>
          <DialogDescription>
            This note is encrypted. Enter the password to view its contents.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="enterPassword" className="text-right">
              Password
            </Label>
            <Input
              id="enterPassword"
              type="password"
              value={passwordStore.password}
              onChange={(e) => passwordStore.setPassword(e.target.value)}
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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Unlock Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { Button } from "@/components/ui/button";
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
import React, { useState, type ComponentProps } from "react";

type PasswordDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mode: "set" | "enter";

  onSubmit: (password: string) => boolean;
};

const PasswordDialog: React.FC<PasswordDialogProps> = (props) => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = () => {
    if (!password.trim()) {
      setPasswordError("Password cannot be empty");
      return;
    }
    const isCorrect = props.onSubmit(password);

    if (!isCorrect) {
      setPasswordError("Incorrect password");
    }
  };
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "set" ? "Set Password" : "Enter Password"}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "set"
              ? "Set a password to encrypt this note. Don't forget it as it cannot be recovered!"
              : "Enter the password to unlock this note."}
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
              className="col-span-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              autoFocus
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm text-center">{passwordError}</p>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => props.onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className={
              props.mode === "set" ? "bg-amber-500 hover:bg-amber-600" : ""
            }
          >
            {props.mode === "set" ? "Set Password" : "Unlock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;

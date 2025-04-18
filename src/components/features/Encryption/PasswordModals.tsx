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

type PasswordModalsProps = {
  showSetPasswordModal: boolean;
  setShowSetPasswordModal: (show: boolean) => void;
  showEnterPasswordModal: boolean;
  setShowEnterPasswordModal: (show: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  passwordError: string;
  setPasswordError: (error: string) => void;
  onSetPassword: () => void;
  onEnterPassword: () => void;
};

export const PasswordModals = ({
  showSetPasswordModal,
  setShowSetPasswordModal,
  showEnterPasswordModal,
  setShowEnterPasswordModal,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  setPasswordError,
  onSetPassword,
  onEnterPassword,
}: PasswordModalsProps) => {
  const handleSetPassword = () => {
    // Validate passwords
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }

    setPasswordError("");
    onSetPassword();
  };

  return (
    <>
      {/* Set Password Modal */}
      <Dialog
        open={showSetPasswordModal}
        onOpenChange={setShowSetPasswordModal}
      >
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <p className="text-red-500 text-sm text-center">
                {passwordError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSetPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSetPassword}>Encrypt Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enter Password Modal */}
      <Dialog
        open={showEnterPasswordModal}
        onOpenChange={setShowEnterPasswordModal}
      >
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEnterPassword();
                }}
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm text-center">
                {passwordError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEnterPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={onEnterPassword}>Unlock Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

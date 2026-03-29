import { Button } from "@/shared/ui/button";
import { LockIcon } from "lucide-react";
import { FC } from "react";

type EncryptedContentProps = {
  onDecrypt: () => void;
};

export const EncryptedContent: FC<EncryptedContentProps> = ({ onDecrypt }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <LockIcon className="mb-4 w-12 h-12 text-muted-foreground" />
      <p className="mb-4 text-muted-foreground">This note is encrypted</p>
      <Button onClick={onDecrypt}>Click here to decrypt</Button>
    </div>
  );
};

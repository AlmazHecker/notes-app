import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type EncryptionToggleProps = {
  isEncrypted: boolean;
  isNoteEncrypted: boolean;
  onEncryptionToggle: () => void;
};

export const EncryptionToggle = ({
  isEncrypted,
  isNoteEncrypted,
  onEncryptionToggle,
}: EncryptionToggleProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={isEncrypted}
          variant="outline"
          size="icon"
          onClick={onEncryptionToggle}
        >
          {isNoteEncrypted ? <Lock className="text-blue-500" /> : <Unlock />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isNoteEncrypted ? "Decrypt Note" : "Encrypt Note"}
      </TooltipContent>
    </Tooltip>
  );
};

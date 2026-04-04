import { isSmallScreen } from "@/shared/lib/utils";
import {
  ChangeEventHandler,
  FC,
  InputEventHandler,
  useEffect,
  useRef,
} from "react";

type Props = {
  value: string;
  setValue: ChangeEventHandler<HTMLTextAreaElement>;
  isEncrypted: boolean;
};

export const Title: FC<Props> = ({ value, setValue, isEncrypted }) => {
  const handleTextareaResize: InputEventHandler<HTMLTextAreaElement> = (e) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
  };

  const titleRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    title.value = value;
    title.style.height = "auto";
    title.style.height = title.scrollHeight + "px";
    if (!isSmallScreen()) {
      title.focus();
      title.setSelectionRange(title.value.length, title.value.length);
    }
  }, [value]);

  useEffect(() => {
    // Enable VirtualKeyboard API overlay if available
    if ((navigator as any).virtualKeyboard) {
      (navigator as any).virtualKeyboard.overlaysContent = true;
    }
  }, []);

  return (
    <div className="px-4 mt-3">
      <textarea
        ref={titleRef}
        className="w-full h-auto text-2xl border-none font-bold border outline-none p-0 resize-none"
        onChange={setValue}
        placeholder="Enter note title"
        readOnly={isEncrypted}
        rows={1}
        onInput={handleTextareaResize}
      />
    </div>
  );
};

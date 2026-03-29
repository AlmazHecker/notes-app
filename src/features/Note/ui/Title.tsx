import { ChangeEventHandler, FC, useEffect, useRef } from "react";

type Props = {
  title: string;
  setTitle: ChangeEventHandler<HTMLTextAreaElement>;
  isEncrypted: boolean;
};

export const Title: FC<Props> = ({ setTitle, title, isEncrypted }) => {
  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const titleRef = useRef<HTMLTextAreaElement>(null);
  // initial height adjustment for title
  useEffect(() => {
    if (!titleRef.current) return;
    titleRef.current.style.height = "auto";
    titleRef.current.style.height = titleRef.current.scrollHeight + "px";
  }, [title]);

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
        defaultValue={title}
        onChange={setTitle}
        placeholder="Enter note title"
        readOnly={isEncrypted}
        rows={1}
        onInput={handleTextareaResize}
      />
    </div>
  );
};

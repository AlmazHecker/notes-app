import { Editor } from "@tiptap/react";
import { useEffect, useState, type FC } from "react";
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
} from "lucide-react";
import "./menubar.css";

export const MenuBar: FC<{ editor: Editor | null }> = ({ editor }) => {
  const [keyboardOffset, setKeyboardOffset] = useState(-100);

  useEffect(() => {
    const virtualKeyboard = (navigator as any).virtualKeyboard;

    const updatePosition = () => {
      let offset = -100;
      let height = 0;

      // 1. Try VirtualKeyboard API (Modern Chromium)
      if (virtualKeyboard?.boundingRect) {
        height = virtualKeyboard.boundingRect.height;
        if (height > 0) {
          offset = height - 45;
        }
      }

      // 2. Fallback to VisualViewport (Safari iOS, older Chromium)
      if (offset === -100 && window.visualViewport) {
        height =
          window.innerHeight -
          window.visualViewport.offsetTop -
          window.visualViewport.height;
        if (height > 0) {
          offset = height - 45;
        }
      }

      setKeyboardOffset(offset);
      document.documentElement.style.setProperty(
        "--keyboard-height",
        `${height > 0 ? height : 0}px`,
      );
    };

    if (virtualKeyboard) {
      virtualKeyboard.addEventListener("geometrychange", updatePosition);
    }
    window.visualViewport?.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    updatePosition();

    return () => {
      if (virtualKeyboard) {
        virtualKeyboard.removeEventListener("geometrychange", updatePosition);
      }
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  if (!editor) return null;

  return (
    <div className="mt-4 py-2 px-4 menubar" style={{ bottom: keyboardOffset }}>
      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="menubar-btn"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="menubar-btn"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      <div className="menubar-divider" />

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={"menubar-btn"}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={"menubar-btn"}
          title="Italic"
        >
          <Italic size={16} />
        </button>
      </div>

      <div className="menubar-divider" />

      <div className="menubar-group">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={"menubar-btn"}
          title="Heading 1"
        >
          <Heading1 size={20} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={"menubar-btn"}
          title="Heading 2"
        >
          <Heading2 size={20} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={"menubar-btn"}
          title="Heading 3"
        >
          <Heading3 size={20} />
        </button>
      </div>

      <div className="menubar-divider" />

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={"menubar-btn"}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={"menubar-btn"}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className="menubar-divider" />

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={"menubar-btn"}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={"menubar-btn"}
          title="Code Block"
        >
          <Code2 size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="menubar-btn"
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </button>
      </div>
    </div>
  );
};

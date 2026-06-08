import type { Editor } from "@tiptap/react";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Undo,
} from "lucide-react";
import { type FC, useEffect, useState } from "react";
import "./toolbar.css";
import { DrawTool } from "../tools/draw";

export const Toolbar: FC<{ editor: Editor | null }> = ({ editor }) => {
  const [keyboardOffset, setKeyboardOffset] = useState(-100);

  useEffect(() => {
    const virtualKeyboard = navigator.virtualKeyboard;

    const updatePosition = () => {
      let offset = -100;
      let height = 0;

      if (virtualKeyboard?.boundingRect) {
        height = virtualKeyboard.boundingRect.height;
        if (height > 0) offset = height;
      }

      if (offset === -100 && window.visualViewport) {
        height =
          window.innerHeight -
          window.visualViewport.offsetTop -
          window.visualViewport.height;
        if (height > 0) offset = height - 45;
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

  const runCommand = (action: () => void) => {
    if (editor.storage.paper?.drawingActive) {
      editor.commands.toggleDrawing?.();
    }
    action();
  };

  return (
    <div className="mt-4 py-2 px-4 toolbar" style={{ bottom: keyboardOffset }}>
      <div className="toolbar-group">
        <button
          onClick={() => runCommand(() => editor.chain().focus().undo().run())}
          className="toolbar-btn"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => runCommand(() => editor.chain().focus().redo().run())}
          className="toolbar-btn"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleBold().run())
          }
          className={"toolbar-btn"}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleItalic().run())
          }
          className={"toolbar-btn"}
          title="Italic"
        >
          <Italic size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          onClick={() =>
            runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run(),
            )
          }
          className={"toolbar-btn"}
          title="Heading 1"
        >
          <Heading1 size={20} />
        </button>
        <button
          onClick={() =>
            runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run(),
            )
          }
          className={"toolbar-btn"}
          title="Heading 2"
        >
          <Heading2 size={20} />
        </button>
        <button
          onClick={() =>
            runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run(),
            )
          }
          className={"toolbar-btn"}
          title="Heading 3"
        >
          <Heading3 size={20} />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleBulletList().run())
          }
          className={"toolbar-btn"}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleOrderedList().run())
          }
          className={"toolbar-btn"}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleBlockquote().run())
          }
          className={"toolbar-btn"}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>

        <button
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleCodeBlock().run())
          }
          className={"toolbar-btn"}
          title="Code Block"
        >
          <Code2 size={16} />
        </button>

        <button
          onClick={() =>
            runCommand(() => editor.chain().focus().setHorizontalRule().run())
          }
          className="toolbar-btn"
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </button>
        <div className="toolbar-divider" />
        <DrawTool editor={editor} />
      </div>
    </div>
  );
};

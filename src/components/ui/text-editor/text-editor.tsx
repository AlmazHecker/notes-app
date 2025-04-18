import "./styles.css";

import { Editor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import { useImperativeHandle, type FC, type RefObject } from "react";
import { useEditor } from "@tiptap/react";

import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import Blockquote from "@tiptap/extension-blockquote";
import { Button } from "../button";
import {
  BoldIcon,
  Heading1,
  Heading2,
  ItalicIcon,
  List,
  ListOrdered,
  Minus,
  Redo,
  TextQuote,
  Undo,
} from "lucide-react";
import { cn } from "@/lib/utils";

const extensions = [
  Heading,
  Document,
  Text,
  OrderedList.configure({ keepMarks: true, keepAttributes: false }),
  ListItem,
  BulletList.configure({ keepMarks: true, keepAttributes: false }),
  Paragraph,
  Bold,
  History,
  Italic,
  Blockquote,
  HorizontalRule,
];

type MenuBarProps = {
  editor: Editor | null;
};
// this component should be migrated to context menu
const MenuBar: FC<MenuBarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    // <div className="sticky p-4 top-0 z-10 border-b">
    <div className="sticky top-0 z-10 pb-2">
      <div className="button-group">
        <Button
          type="button"
          variant="outline"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          size="icon"
          className={cn(editor.isActive("bold") && "bg-input/70!")}
        >
          <BoldIcon />
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          size="icon"
          className={cn(editor.isActive("italic") && "bg-input/70!")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            editor.isActive("heading", { level: 1 }) && "bg-input/70!"
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            editor.isActive("heading", { level: 2 }) && "bg-input/70!"
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(editor.isActive("bulletList") && "bg-input/70!")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(editor.isActive("orderedList") && "bg-input/70!")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(editor.isActive("blockquote") && "bg-input/70!")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <TextQuote />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo />
        </Button>
      </div>
    </div>
  );
};

type TextEditorProps = {
  onChange?: (text: string) => void;
  value?: string;
  ref: RefObject<Editor | null>;
  editable?: boolean;
  className?: string;
};

export const TextEditor: FC<TextEditorProps> = ({
  editable = true,
  value,
  onChange,
  ref,
  className,
}) => {
  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions,
      content: value,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getText());
      },
      editable,
    },
    [editable, value]
  );

  useImperativeHandle(ref, () => editor!, [editor]);

  return (
    <div className={className}>
      {/* {editor?.isEditable && <MenuBar editor={editor} />} */}
      <EditorContent value={value} editor={editor} />
    </div>
  );
};

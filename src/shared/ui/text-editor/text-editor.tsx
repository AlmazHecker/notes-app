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

import SearchAndReplace from "./extensions/searchAndReplace";

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
  SearchAndReplace.configure(),
];

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
        onChange?.(editor.getHTML());
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

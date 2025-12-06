import "./styles.css";

import { Editor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import { Ref, useImperativeHandle, type FC } from "react";
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
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, all } from "lowlight";
import SearchAndReplace from "./extensions/searchAndReplace";

const lowlight = createLowlight(all);
lowlight.register({});

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
  CodeBlockLowlight.configure({ lowlight }),
];

type TextEditorProps = {
  value?: string;
  ref: Ref<Editor | null>;
  editable?: boolean;
};

export const TextEditor: FC<TextEditorProps> = ({
  editable = true,
  value,
  ref,
}) => {
  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions,
      content: value,
      editable,
    },
    [editable, value]
  );

  useImperativeHandle(ref, () => editor!, [editor]);

  return (
    <>
      <EditorContent
        className="p-4 editor-content"
        onClick={() => editor?.chain().focus()}
        editor={editor}
      />
    </>
  );
};

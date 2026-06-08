import "./styles.css";

import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { type Editor, EditorContent } from "@tiptap/react";
import { all, createLowlight } from "lowlight";
import type { FC } from "react";
import Paper from "./extensions/paper";
import SearchAndReplace from "./extensions/search-and-replace";

const lowlight = createLowlight(all);
lowlight.register({});

export const EDITOR_EXTENSIONS = [
  Heading,
  Document,
  Paper,
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
  editor: Editor;
};

export const TextEditor: FC<TextEditorProps> = ({ editor }) => {
  return (
    <EditorContent
      className="p-4 pt-0 md:pt-4 editor-content flex-1 flex flex-col"
      onClick={() => editor?.chain().focus()}
      editor={editor}
    />
  );
};

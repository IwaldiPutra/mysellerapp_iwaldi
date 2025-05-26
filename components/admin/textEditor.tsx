"use client";

import "./styles.css";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useEditor, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

type TiptapEditorProps = {
  onChange?: (html: string) => void;
  content: string;
};

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <div className="control">
      <ToggleGroup
        size="sm"
        className="justify-start flex flex-wrap p-2"
        type="multiple"
      >
        <ToggleGroupItem
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-300" : "bg-gray-100"}
          value="bold"
        >
          <Bold className="w-4 h-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-300" : "bg-gray-100"}
          value="italic"
        >
          <Italic className="w-4 h-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-gray-300" : "bg-gray-100"}
          value="strike"
        >
          <Strikethrough className="w-4 h-4" />
        </ToggleGroupItem>

        <p className="mx-2 opacity-50">|</p>

        <ToggleGroupItem
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-300"
              : "bg-gray-100"
          }
          value="heading1"
        >
          <Heading1 className="w-4 h-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-300"
              : "bg-gray-100"
          }
          value="heading2"
        >
          <Heading2 className="w-4 h-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-300"
              : "bg-gray-100"
          }
          value="heading3"
        >
          <Heading3 className="w-4 h-4" />
        </ToggleGroupItem>

        <p className="mx-2 opacity-50">|</p>

        <ToggleGroupItem
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "bg-gray-300" : "bg-gray-100"
          }
          value="bulletList"
        >
          <List className="w-4 h-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" })
              ? "bg-gray-300"
              : "bg-gray-100"
          }
          value="align-left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" })
              ? "bg-gray-300"
              : "bg-gray-100"
          }
          value="align-center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" })
              ? "bg-gray-300"
              : "bg-gray-100"
          }
          value="align-right"
        >
          <AlignRight className="w-4 h-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" })
              ? "bg-gray-300"
              : "bg-gray-100"
          }
          value="align-justify"
        >
          <AlignJustify className="w-4 h-4" />
        </ToggleGroupItem>

        <p className="mx-2 opacity-50">|</p>

        <ToggleGroupItem
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="bg-gray-100"
          value="undo"
        >
          <Undo className="w-4 h-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="bg-gray-100"
          value="redo"
        >
          <Redo className="w-4 h-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <hr />
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure(),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: true,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];

const WordCount = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const text = editor.getText();
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <div className="p-3 text-xs text-muted-foreground">
      {wordCount} {wordCount === 1 ? "word" : "words"} / {charCount}{" "}
      {charCount === 1 ? "character" : "characters"}
    </div>
  );
};

export default function TiptapEditor({ onChange, content }: TiptapEditorProps) {
  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      editorProps={{
        attributes: {
          className:
            "prose focus:outline-none min-h-[150px] p-2 border rounded",
        },
      }}
      slotBefore={<MenuBar />}
      onUpdate={({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
      }}
    >
      <div className="editor" />
      <hr />
      <WordCount />
    </EditorProvider>
  );
}

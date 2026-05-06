"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { Bold, Italic } from "lucide-react";

interface Props {
  content: string;
  onChange: (value: string) => void;
}

export default function TextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md p-2 space-y-2">
      <div className="flex gap-2">
        <Button
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </Button>
        <Button
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </Button>
      </div>

      <EditorContent editor={editor} className="min-h-25" />
    </div>
  );
}

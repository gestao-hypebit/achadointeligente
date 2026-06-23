"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function EditorConteudo({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  const toolbarButtons = [
    { label: "B", action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold") },
    { label: "I", action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic") },
    { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) },
    { label: "H3", action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive("heading", { level: 3 }) },
    { label: "Lista", action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive("bulletList") },
    { label: "Parágrafo", action: () => editor?.chain().focus().setParagraph().run(), active: editor?.isActive("paragraph") },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex flex-wrap gap-1">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              btn.active
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-48 focus:outline-none [&_.ProseMirror]:outline-none"
      />
    </div>
  );
}

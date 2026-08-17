import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Link2, List } from "lucide-react";

// Toolbar limited to exactly what StarterKit's default node/mark set (and
// the backend's Sanitizer allow-list in UpdateContentBlocksCommand.cs)
// can actually produce — keeping both in sync avoids silently stripping
// formatting the editor shows on save.
export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        code: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[80px] px-4 py-2.5 text-sm",
      },
    },
  });

  // useEditor's `content` option only seeds the editor at construction
  // time — it does not react to later prop changes. The content blocks
  // this wraps arrive from an async fetch, so the field it initially
  // mounts with is often still "" for one render before the real value
  // loads; without this sync the editor stays permanently empty (same
  // "async data after mount" bug class hit earlier with whileInView).
  // Skipped while focused so it doesn't fight the user's own typing.
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    if (editor.getHTML() === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-line focus-within:border-gold-dark">
      <div className="flex items-center gap-1 border-b border-line bg-paper px-2 py-1.5">
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold">
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic">
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Bullet list"
        >
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
          label="Link"
        >
          <Link2 size={14} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`rounded p-1.5 ${active ? "bg-gold text-gold-ink" : "text-ink-soft hover:bg-line"}`}
    >
      {children}
    </button>
  );
}

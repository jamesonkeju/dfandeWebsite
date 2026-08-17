import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import {
  useGetContentBlocksQuery,
  useUpdateContentBlocksMutation,
  type ContentBlock,
  type ContentBlockUpdateItem,
} from "@/features/content/api/contentApi";
import { JSON_FIELD_MANIFESTS } from "@/features/content/jsonFieldManifests";
import { RichTextEditor } from "@/features/content/components/RichTextEditor";

const PAGE_GROUPS = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "certifications", label: "Certifications" },
  { value: "careers", label: "Careers" },
  { value: "company", label: "Company" },
  { value: "partners", label: "Partners" },
];

// Local edit-buffer shape, keyed by ContentBlock.key. Dot-namespaced keys
// (e.g. "home.hero.eyebrow") are kept as literal flat keys here rather
// than passed through Formik — Formik's `name` prop always splits on
// dots into nested paths, which would silently misbehave for content
// keys that are dot-namespaced by design, not nested form data.
type EditState = Record<string, { text?: string; list?: string[]; json?: Record<string, unknown>[] | Record<string, unknown> }>;

function buildEditState(blocks: ContentBlock[]): EditState {
  const state: EditState = {};
  for (const block of blocks) {
    if (block.valueType === "Json") {
      const manifest = JSON_FIELD_MANIFESTS[block.key];
      const parsed = block.jsonValue ? JSON.parse(block.jsonValue) : manifest?.kind === "array" ? [] : {};
      state[block.key] = { json: parsed };
    } else if (block.valueType === "List") {
      state[block.key] = { list: block.listValue ?? [] };
    } else {
      state[block.key] = { text: block.textValue ?? "" };
    }
  }
  return state;
}

export function ContentBlocksPage() {
  const { pageGroup = "home" } = useParams<{ pageGroup: string }>();
  const navigate = useNavigate();
  const { data: allBlocks, isLoading, isError } = useGetContentBlocksQuery();
  const [updateContentBlocks, { isLoading: isSaving }] = useUpdateContentBlocksMutation();

  const blocks = useMemo(
    () => (allBlocks ?? []).filter((b) => b.pageGroup === pageGroup).sort((a, b) => a.displayOrder - b.displayOrder),
    [allBlocks, pageGroup],
  );

  const [edits, setEdits] = useState<EditState>({});
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (blocks.length > 0) setEdits(buildEditState(blocks));
  }, [blocks]);

  async function handleSave() {
    const payload: ContentBlockUpdateItem[] = blocks.map((block) => {
      const edit = edits[block.key];
      if (block.valueType === "List") return { key: block.key, listValue: edit?.list ?? [] };
      if (block.valueType === "Json") return { key: block.key, jsonValue: JSON.stringify(edit?.json ?? {}) };
      return { key: block.key, textValue: edit?.text ?? "" };
    });

    await updateContentBlocks({ pageGroup, blocks: payload }).unwrap();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Site Content</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Edit the copy shown across the public site and homepage sections. Fields are grouped by page.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-4">
        {PAGE_GROUPS.map((g) => (
          <button
            key={g.value}
            type="button"
            onClick={() => navigate(`/admin/content/${g.value}`)}
            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
              pageGroup === g.value
                ? "border-gold-dark bg-gold text-gold-ink"
                : "border-line text-ink-soft hover:border-gold-dark hover:text-gold-dark"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-2xl space-y-6">
        {isLoading && <p className="text-sm text-ink-soft">Loading…</p>}
        {isError && <p className="text-sm text-danger">Couldn't load content. Is the API running?</p>}

        {blocks.map((block) => (
          <div key={block.key}>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
              {block.displayLabel}
            </label>
            {block.helpText && <p className="mb-1.5 text-xs text-steel">{block.helpText}</p>}

            {block.valueType === "PlainText" && (
              <input
                value={edits[block.key]?.text ?? ""}
                onChange={(e) => setEdits((prev) => ({ ...prev, [block.key]: { text: e.target.value } }))}
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
              />
            )}

            {block.valueType === "RichText" && (
              <RichTextEditor
                value={edits[block.key]?.text ?? ""}
                onChange={(html) => setEdits((prev) => ({ ...prev, [block.key]: { text: html } }))}
              />
            )}

            {block.valueType === "List" && (
              <ListEditor
                values={edits[block.key]?.list ?? []}
                onChange={(list) => setEdits((prev) => ({ ...prev, [block.key]: { list } }))}
              />
            )}

            {block.valueType === "Json" && (
              <JsonEditor
                blockKey={block.key}
                value={edits[block.key]?.json}
                onChange={(json) => setEdits((prev) => ({ ...prev, [block.key]: { json } }))}
              />
            )}
          </div>
        ))}

        {blocks.length > 0 && (
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-gold-ink hover:bg-gold-dark disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
            {savedMessage && <span className="text-sm font-bold text-verify">Saved.</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function ListEditor({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {values.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => onChange(values.map((v, i) => (i === index ? e.target.value : v)))}
            className="w-full rounded-lg border border-line px-4 py-2 text-sm outline-none focus:border-gold-dark"
          />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            className="flex-none rounded-lg border border-line px-2 text-ink-soft hover:border-danger hover:text-danger"
            aria-label="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-gold-dark"
      >
        <Plus size={14} />
        Add item
      </button>
    </div>
  );
}

function JsonEditor({
  blockKey,
  value,
  onChange,
}: {
  blockKey: string;
  value: Record<string, unknown>[] | Record<string, unknown> | undefined;
  onChange: (v: Record<string, unknown>[] | Record<string, unknown>) => void;
}) {
  const manifest = JSON_FIELD_MANIFESTS[blockKey];
  if (!manifest) {
    return <p className="text-xs text-danger">No form defined for this field.</p>;
  }

  if (manifest.kind === "object") {
    const obj = (value as Record<string, unknown>) ?? {};
    return (
      <div className="space-y-2 rounded-lg border border-line p-4">
        {manifest.fields.map((field) => (
          <div key={field.name}>
            <span className="mb-1 block text-xs text-steel">{field.label}</span>
            <input
              type={field.type === "number" ? "number" : "text"}
              value={(obj[field.name] as string | number | undefined) ?? ""}
              onChange={(e) => onChange({ ...obj, [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value })}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-gold-dark"
            />
          </div>
        ))}
      </div>
    );
  }

  const items = (value as Record<string, unknown>[]) ?? [];

  function updateItem(index: number, field: string, fieldValue: unknown) {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: fieldValue } : item)));
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="space-y-2 rounded-lg border border-line p-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="rounded-lg border border-line px-2 py-1 text-ink-soft hover:border-danger hover:text-danger"
              aria-label="Remove entry"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {manifest.fields.map((field) => (
            <div key={field.name}>
              <span className="mb-1 block text-xs text-steel">{field.label}</span>
              {field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(item[field.name])}
                  onChange={(e) => updateItem(index, field.name, e.target.checked)}
                  className="h-4 w-4 rounded border-line"
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={(item[field.name] as string | number | undefined) ?? ""}
                  onChange={(e) =>
                    updateItem(index, field.name, field.type === "number" ? Number(e.target.value) : e.target.value)
                  }
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-gold-dark"
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, Object.fromEntries(manifest.fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]))])}
        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-gold-dark"
      >
        <Plus size={14} />
        Add entry
      </button>
    </div>
  );
}

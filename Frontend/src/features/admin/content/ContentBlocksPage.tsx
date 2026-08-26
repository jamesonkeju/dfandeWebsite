import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  Building2,
  Layers,
  Award,
  HelpCircle,
  Briefcase,
  Globe,
  Users,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  X,
  ExternalLink,
  Eye,
} from "lucide-react";
import {
  useGetContentBlocksQuery,
  useUpdateContentBlocksMutation,
  type ContentBlock,
  type ContentBlockUpdateItem,
} from "@/features/content/api/contentApi";
import { JSON_FIELD_MANIFESTS } from "@/features/content/jsonFieldManifests";
import { RichTextEditor } from "@/features/content/components/RichTextEditor";
import { CmsPreviewModal } from "@/features/admin/components/CmsPreviewModal";

interface PageGroupMeta {
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  liveUrl?: string;
}

const PAGE_GROUPS: PageGroupMeta[] = [
  {
    value: "home",
    label: "Home Page",
    description: "Hero headlines, statistics callouts, value pillars, and executive statement copy.",
    icon: Sparkles,
    liveUrl: "/",
  },
  {
    value: "company",
    label: "Company & Facilities",
    description: "Corporate addresses, workshop floor specifications, hydro testing limits, and contact phones.",
    icon: Globe,
    liveUrl: "/contact",
  },
  {
    value: "about",
    label: "About & Milestones",
    description: "Corporate history, 2003–present evolution milestones, and executive mission statements.",
    icon: Building2,
    liveUrl: "/about",
  },
  {
    value: "services",
    label: "Services & Case Studies",
    description: "Preservation before/after case studies, workshop testing ranges, and field advisory notices.",
    icon: Layers,
    liveUrl: "/services",
  },
  {
    value: "certifications",
    label: "Certifications & QA/HSE",
    description: "ISO 9001/14001/45001 standards, NCEC registration codes, and signed executive policy statements.",
    icon: Award,
    liveUrl: "/certifications",
  },
  {
    value: "faq",
    label: "Engineering FAQs",
    description: "Categorized technical questions, response disclosures, and engineering advisory notice.",
    icon: HelpCircle,
    liveUrl: "/faq",
  },
  {
    value: "careers",
    label: "Careers & Culture",
    description: "Engineering culture pillars, recruitment notices, and candidate evaluation criteria.",
    icon: Briefcase,
    liveUrl: "/careers",
  },
  {
    value: "partners",
    label: "Partners & OEM Network",
    description: "Major oil operator clients (Total, Chevron, ExxonMobil) and global OEM alliances.",
    icon: Users,
    liveUrl: "/about",
  },
];

type EditState = Record<
  string,
  { text?: string; list?: string[]; json?: Record<string, unknown>[] | Record<string, unknown> }
>;

function buildEditState(blocks: ContentBlock[]): EditState {
  const state: EditState = {};
  for (const block of blocks) {
    if (block.valueType === "Json") {
      const manifest = JSON_FIELD_MANIFESTS[block.key];
      const parsed = block.jsonValue
        ? JSON.parse(block.jsonValue)
        : manifest?.kind === "array"
        ? []
        : {};
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

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({});
  const [savedMessage, setSavedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [jsonExportOpen, setJsonExportOpen] = useState(false);
  const [livePreviewOpen, setLivePreviewOpen] = useState(false);

  const rawBlocks = useMemo(
    () =>
      (allBlocks ?? [])
        .filter((b) => b.pageGroup === pageGroup)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [allBlocks, pageGroup],
  );

  const [edits, setEdits] = useState<EditState>({});
  const [initialEdits, setInitialEdits] = useState<EditState>({});

  useEffect(() => {
    if (rawBlocks.length > 0) {
      const state = buildEditState(rawBlocks);
      setEdits(state);
      setInitialEdits(JSON.parse(JSON.stringify(state)));
    }
  }, [rawBlocks]);

  // Track if current page has uncommitted modifications
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(edits) !== JSON.stringify(initialEdits);
  }, [edits, initialEdits]);

  const filteredBlocks = useMemo(() => {
    return rawBlocks.filter((b) => {
      if (typeFilter !== "ALL" && b.valueType !== typeFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        b.displayLabel.toLowerCase().includes(q) ||
        b.key.toLowerCase().includes(q) ||
        (b.helpText ?? "").toLowerCase().includes(q)
      );
    });
  }, [rawBlocks, search, typeFilter]);

  const currentGroupMeta = PAGE_GROUPS.find((g) => g.value === pageGroup) ?? {
    value: pageGroup,
    label: pageGroup,
    description: "Manage editorial copy and parameters for this section.",
    icon: Layers,
    liveUrl: "/",
  };

  const GroupIcon = currentGroupMeta.icon;

  const toggleCollapse = (key: string) => {
    setCollapsedBlocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    rawBlocks.forEach((b) => (next[b.key] = true));
    setCollapsedBlocks(next);
  };

  const expandAll = () => {
    setCollapsedBlocks({});
  };

  const handleResetAll = () => {
    if (confirm("Discard all unsaved edits on this page?")) {
      setEdits(JSON.parse(JSON.stringify(initialEdits)));
    }
  };

  const handleResetBlock = (key: string) => {
    if (initialEdits[key]) {
      setEdits((prev) => ({ ...prev, [key]: JSON.parse(JSON.stringify(initialEdits[key])) }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  async function handleSave() {
    try {
      setErrorMessage(null);
      const payload: ContentBlockUpdateItem[] = rawBlocks.map((block) => {
        const edit = edits[block.key];
        if (block.valueType === "List") return { key: block.key, listValue: edit?.list ?? [] };
        if (block.valueType === "Json")
          return { key: block.key, jsonValue: JSON.stringify(edit?.json ?? {}) };
        return { key: block.key, textValue: edit?.text ?? "" };
      });

      await updateContentBlocks({ pageGroup, blocks: payload }).unwrap();
      setInitialEdits(JSON.parse(JSON.stringify(edits)));
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err: any) {
      setErrorMessage(err?.data?.message || err?.message || "Failed to update content blocks.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-dark">
            <Sparkles size={15} />
            <span>DF&amp;E Content Management System</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-ink">Site Content Engine</h1>
          <p className="mt-0.5 text-xs text-steel">
            Edit technical facts, engineering statistics, case studies, policy statements, and rich HTML copy.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentGroupMeta.liveUrl && (
            <a
              href={currentGroupMeta.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-steel hover:border-gold-dark hover:text-gold-dark transition-colors shadow-2xs"
            >
              <ExternalLink size={13} />
              <span>View Live Page</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setJsonExportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-ink hover:border-gold-dark transition-colors shadow-2xs cursor-pointer"
            title="Inspect raw JSON configuration for this page"
          >
            <Download size={13} />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setLivePreviewOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gold-dark/40 bg-gold/10 px-3.5 py-2.5 text-xs font-bold text-gold-dark hover:bg-gold/20 transition-colors shadow-2xs cursor-pointer"
          >
            <Eye size={13} />
            <span>Live Preview</span>
          </button>

          {rawBlocks.length > 0 && (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer ${
                hasUnsavedChanges
                  ? "bg-gold text-gold-ink hover:bg-gold-light ring-2 ring-gold/40"
                  : "bg-ink text-white hover:bg-ink-soft disabled:opacity-50"
              }`}
            >
              <CheckCircle2 size={15} />
              <span>{isSaving ? "Publishing…" : "Save Changes"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {savedMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-2xs">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>All content updates for "{currentGroupMeta.label}" saved and published to database!</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-danger/20 bg-danger/10 p-4 text-xs font-bold text-danger">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {hasUnsavedChanges && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>You have unsaved changes in "{currentGroupMeta.label}". Remember to click Save Changes.</span>
          </div>
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1 text-[11px] font-bold uppercase text-amber-800 hover:underline cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Discard Edits</span>
          </button>
        </div>
      )}

      {/* Primary Section Tabs Grid */}
      <div className="rounded-3xl border border-line bg-white p-3 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PAGE_GROUPS.map((g) => {
            const isActive = pageGroup === g.value;
            const count = (allBlocks ?? []).filter((b) => b.pageGroup === g.value).length;
            const Icon = g.icon;

            return (
              <button
                key={g.value}
                type="button"
                onClick={() => {
                  setSearch("");
                  navigate(`/admin/content/${g.value}`);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl text-center transition-all cursor-pointer ${
                  isActive
                    ? "bg-gold text-gold-ink shadow-sm ring-1 ring-gold"
                    : "border border-line bg-paper-raised/60 text-steel hover:bg-paper hover:text-ink hover:border-gold/40"
                }`}
              >
                <Icon size={18} className={isActive ? "text-gold-ink" : "text-steel"} />
                <span className="mt-1 text-[11px] font-bold leading-tight line-clamp-1">{g.label}</span>
                <span
                  className={`mt-1 rounded-full px-1.5 py-0.2 font-mono text-[9px] font-bold ${
                    isActive ? "bg-gold-ink/20 text-gold-ink" : "bg-paper text-steel"
                  }`}
                >
                  {count} fields
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Header & Filter Controls Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark flex-none">
            <GroupIcon size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink">{currentGroupMeta.label}</h2>
            <p className="text-xs text-steel line-clamp-1">{currentGroupMeta.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search content fields…"
              className="w-full rounded-xl border border-line bg-paper-raised py-1.5 pl-9 pr-3 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-line bg-paper-raised px-3 py-1.5 text-xs font-bold text-ink focus:border-gold-dark focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="PlainText">Plain Text</option>
            <option value="RichText">Rich HTML</option>
            <option value="List">List Arrays</option>
            <option value="Json">Structured JSON</option>
          </select>

          {/* Accordion Controls */}
          <button
            type="button"
            onClick={expandAll}
            className="rounded-xl border border-line bg-white px-2.5 py-1.5 text-[11px] font-bold text-steel hover:text-ink cursor-pointer"
            title="Expand all panels"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-xl border border-line bg-white px-2.5 py-1.5 text-[11px] font-bold text-steel hover:text-ink cursor-pointer"
            title="Collapse all panels"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Content Blocks List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="rounded-3xl border border-line bg-white p-12 text-center text-xs text-steel shadow-2xs">
            Loading editorial parameters for "{currentGroupMeta.label}"…
          </div>
        )}

        {isError && (
          <div className="rounded-3xl border border-line bg-white p-12 text-center text-xs text-danger shadow-2xs">
            Could not connect to CMS database. Please ensure backend is running.
          </div>
        )}

        {!isLoading && !isError && rawBlocks.length === 0 && (
          <div className="rounded-3xl border border-line bg-white p-12 text-center text-xs text-steel shadow-2xs">
            No configurable blocks found for "{currentGroupMeta.label}".
          </div>
        )}

        {!isLoading && !isError && filteredBlocks.length > 0 && (
          <div className="space-y-4">
            {filteredBlocks.map((block) => {
              const isCollapsed = Boolean(collapsedBlocks[block.key]);
              const blockEdit = edits[block.key];
              const blockInitial = initialEdits[block.key];
              const isBlockModified = JSON.stringify(blockEdit) !== JSON.stringify(blockInitial);

              // Calculate item/character metric
              const metricText =
                block.valueType === "PlainText"
                  ? `${blockEdit?.text?.length ?? 0} chars`
                  : block.valueType === "RichText"
                  ? `${(blockEdit?.text ?? "").replace(/<[^>]*>/g, "").length} chars`
                  : block.valueType === "List"
                  ? `${blockEdit?.list?.length ?? 0} items`
                  : Array.isArray(blockEdit?.json)
                  ? `${blockEdit.json.length} items`
                  : "1 object";

              return (
                <div
                  key={block.key}
                  className={`rounded-3xl border bg-white shadow-2xs transition-all ${
                    isBlockModified ? "border-amber-300 ring-1 ring-amber-300/50" : "border-line hover:border-gold/40"
                  }`}
                >
                  {/* Card Header Accordion */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-line bg-paper-raised/40 rounded-t-3xl">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleCollapse(block.key)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-white text-steel hover:text-ink cursor-pointer flex-none"
                      >
                        {isCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-ink">
                            {block.displayLabel}
                          </span>
                          <span className="rounded-full bg-paper px-2 py-0.5 font-mono text-[9px] font-bold text-steel uppercase">
                            {block.valueType}
                          </span>
                          {isBlockModified && (
                            <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.2 font-mono text-[9px] font-bold">
                              Modified
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(block.key)}
                            className="font-mono text-[10px] text-steel hover:text-gold-dark transition-colors cursor-pointer text-left truncate"
                            title="Click to copy key identifier"
                          >
                            key: {block.key} {copiedKey === block.key && <span className="text-emerald-600 font-bold">(Copied!)</span>}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-steel bg-white border border-line px-2 py-0.5 rounded-lg">
                        {metricText}
                      </span>

                      {isBlockModified && (
                        <button
                          type="button"
                          onClick={() => handleResetBlock(block.key)}
                          className="flex items-center gap-1 text-[11px] font-bold text-steel hover:text-danger cursor-pointer"
                          title="Revert this block to last saved value"
                        >
                          <RefreshCw size={12} />
                          <span>Revert</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Body Editor */}
                  {!isCollapsed && (
                    <div className="p-6 space-y-4">
                      {block.helpText && (
                        <p className="rounded-xl bg-paper-raised px-4 py-2 text-xs text-steel border border-line/60">
                          {block.helpText}
                        </p>
                      )}

                      {/* Plain Text Input */}
                      {block.valueType === "PlainText" && (
                        <div>
                          <input
                            value={edits[block.key]?.text ?? ""}
                            onChange={(e) =>
                              setEdits((prev) => ({
                                ...prev,
                                [block.key]: { text: e.target.value },
                              }))
                            }
                            className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-xs font-semibold text-ink outline-none focus:border-gold-dark focus:bg-white"
                            placeholder="Enter single line text value…"
                          />
                        </div>
                      )}

                      {/* Rich Text Editor */}
                      {block.valueType === "RichText" && (
                        <div className="space-y-2">
                          <RichTextEditor
                            value={edits[block.key]?.text ?? ""}
                            onChange={(html) =>
                              setEdits((prev) => ({
                                ...prev,
                                [block.key]: { text: html },
                              }))
                            }
                          />
                        </div>
                      )}

                      {/* List Editor */}
                      {block.valueType === "List" && (
                        <ListEditor
                          values={edits[block.key]?.list ?? []}
                          onChange={(list) =>
                            setEdits((prev) => ({
                              ...prev,
                              [block.key]: { list },
                            }))
                          }
                        />
                      )}

                      {/* Structured JSON Editor */}
                      {block.valueType === "Json" && (
                        <SpecializedJsonEditor
                          blockKey={block.key}
                          value={edits[block.key]?.json}
                          onChange={(json) =>
                            setEdits((prev) => ({
                              ...prev,
                              [block.key]: { json },
                            }))
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom Floating Save Action Bar */}
            <div className="flex items-center justify-between rounded-3xl border border-line bg-white p-5 shadow-sm">
              <div className="text-xs text-steel font-medium">
                {hasUnsavedChanges ? (
                  <span className="text-amber-800 font-bold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Unsaved changes pending commit
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    All blocks up-to-date
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {hasUnsavedChanges && (
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-steel hover:bg-paper cursor-pointer"
                  >
                    Discard Changes
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink shadow-sm transition-all hover:bg-gold-light disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  <span>{isSaving ? "Saving…" : "Save All Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EXPORT JSON MODAL */}
      {jsonExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4 backdrop-blur-xs">
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="text-base font-bold text-ink">Page Configuration Payload</h3>
                <p className="text-xs text-steel font-mono">pageGroup: {pageGroup}</p>
              </div>
              <button
                type="button"
                onClick={() => setJsonExportOpen(false)}
                className="rounded-lg p-1 text-steel hover:text-ink cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <pre className="my-4 max-h-[55vh] overflow-auto rounded-2xl border border-line bg-void p-4 font-mono text-xs text-emerald-400">
              {JSON.stringify(edits, null, 2)}
            </pre>

            <div className="flex items-center justify-between border-t border-line pt-3">
              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(edits, null, 2))}
                className="flex items-center gap-1 text-xs font-bold text-gold-dark hover:underline cursor-pointer"
              >
                <span>Copy JSON to Clipboard</span>
              </button>
              <button
                type="button"
                onClick={() => setJsonExportOpen(false)}
                className="rounded-xl border border-line px-5 py-2 text-xs font-bold text-steel hover:bg-paper cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CMS LIVE PREVIEW MODAL */}
      <CmsPreviewModal
        isOpen={livePreviewOpen}
        onClose={() => setLivePreviewOpen(false)}
        title={`Preview Page: ${currentGroupMeta.label}`}
        subtitle="Live rendering of drafted content block strings, headlines, and parameters"
        onSave={handleSave}
        isSaving={isSaving}
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-paper p-6 space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold-dark">
              Section: {currentGroupMeta.label}
            </span>
            <h3 className="text-xl font-bold text-ink">Draft Content Configuration</h3>
            <p className="text-xs text-steel">{currentGroupMeta.description}</p>
          </div>

          <div className="space-y-4">
            {rawBlocks.map((block) => {
              const edit = edits[block.key];
              return (
                <div key={block.key} className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="text-xs font-bold text-ink">{block.displayLabel}</span>
                    <span className="font-mono text-[10px] text-steel">{block.key}</span>
                  </div>

                  {block.valueType === "PlainText" && (
                    <p className="text-sm font-semibold text-ink">{edit?.text || <span className="text-steel italic">Empty</span>}</p>
                  )}

                  {block.valueType === "RichText" && (
                    <div
                      className="prose prose-sm max-w-none text-xs text-ink-soft"
                      dangerouslySetInnerHTML={{ __html: edit?.text || "<em>Empty HTML</em>" }}
                    />
                  )}

                  {block.valueType === "List" && (
                    <ul className="list-disc list-inside text-xs text-ink-soft space-y-1">
                      {(edit?.list ?? []).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {block.valueType === "Json" && (
                    <pre className="rounded-xl bg-paper p-3 font-mono text-[11px] text-ink overflow-x-auto">
                      {JSON.stringify(edit?.json ?? {}, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CmsPreviewModal>
    </div>
  );
}

// -------------------------------------------------------------
// LIST EDITOR WITH MOVE & REMOVE
// -------------------------------------------------------------
function ListEditor({
  values,
  onChange,
}: {
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="space-y-2.5">
      {values.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-steel w-6 text-right flex-none">
            #{index + 1}
          </span>
          <input
            value={item}
            onChange={(e) =>
              onChange(values.map((v, i) => (i === index ? e.target.value : v)))
            }
            className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2 text-xs font-medium text-ink outline-none focus:border-gold-dark focus:bg-white"
            placeholder={`Item #${index + 1}`}
          />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            className="rounded-xl border border-line p-2 text-steel hover:border-danger hover:text-danger cursor-pointer transition-colors"
            aria-label="Remove item"
            title="Delete entry"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-gold/50 bg-gold/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold-dark hover:bg-gold/15 transition-colors cursor-pointer"
      >
        <Plus size={14} />
        <span>Add List Item</span>
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// SPECIALIZED STRUCTURED JSON EDITORS
// -------------------------------------------------------------
function SpecializedJsonEditor({
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
    return (
      <div className="rounded-2xl border border-line bg-void p-4 font-mono text-xs text-emerald-400">
        {JSON.stringify(value, null, 2)}
      </div>
    );
  }

  // OBJECT (HEADLINES ETC)
  if (manifest.kind === "object") {
    const obj = (value as Record<string, unknown>) ?? {};
    return (
      <div className="rounded-2xl border border-line bg-paper-raised p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {manifest.fields.map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-steel">
                {field.label}
              </label>
              <input
                type={field.type === "number" ? "number" : "text"}
                value={(obj[field.name] as string | number | undefined) ?? ""}
                onChange={(e) =>
                  onChange({
                    ...obj,
                    [field.name]:
                      field.type === "number" ? Number(e.target.value) : e.target.value,
                  })
                }
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-medium text-ink outline-none focus:border-gold-dark"
                placeholder={field.label}
              />
            </div>
          ))}
        </div>

        {/* Live Headline Simulation */}
        {obj["plain"] !== undefined && obj["highlight"] !== undefined && (
          <div className="mt-3 rounded-xl border border-line bg-white p-4">
            <span className="block text-[10px] font-bold uppercase text-steel mb-1">Live Headline Preview:</span>
            <div className="text-base font-bold text-ink">
              {String(obj["plain"])}{" "}
              <span className="text-gold-dark font-serif italic">{String(obj["highlight"])}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ARRAY OF OBJECTS
  const items = (value as Record<string, unknown>[]) ?? [];

  function updateItem(index: number, field: string, fieldValue: unknown) {
    onChange(
      items.map((item, i) => (i === index ? { ...item, [field]: fieldValue } : item)),
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        // Render tailored preview badges
        const statPreview =
          item["value"] !== undefined && item["label"]
            ? `${item["prefix"] || ""}${item["value"]}${item["suffix"] || ""} — ${item["label"]}`
            : null;

        const faqPreview = item["question"] ? String(item["question"]) : null;
        const milestonePreview = item["year"] && item["title"] ? `${item["year"]}: ${item["title"]}` : null;
        const certPreview = item["code"] ? `${item["code"]} — ${item["label"] || ""}` : null;

        const cardHeading = milestonePreview || faqPreview || certPreview || statPreview || `Entry #${index + 1}`;

        return (
          <div
            key={index}
            className="rounded-2xl border border-line bg-paper-raised p-4 space-y-3 relative transition-colors hover:border-gold/40"
          >
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <span className="font-bold text-xs text-ink truncate max-w-[80%]">
                {cardHeading}
              </span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="flex items-center gap-1 rounded-lg border border-line bg-white px-2 py-1 text-[10px] font-bold text-steel hover:border-danger hover:text-danger cursor-pointer transition-colors"
                aria-label="Remove entry"
                title="Delete Entry"
              >
                <Trash2 size={12} />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {manifest.fields.map((field) => (
                <div key={field.name} className={field.name === "description" || field.name === "answer" || field.name === "scope" ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-steel">
                    {field.label}
                  </label>

                  {field.type === "checkbox" ? (
                    <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(item[field.name])}
                        onChange={(e) => updateItem(index, field.name, e.target.checked)}
                        className="h-4 w-4 rounded border-line text-gold focus:ring-gold"
                      />
                      <span className="text-xs font-bold text-ink">{field.label}</span>
                    </label>
                  ) : field.name === "answer" || field.name === "description" || field.name === "scope" ? (
                    <textarea
                      rows={2}
                      value={(item[field.name] as string | undefined) ?? ""}
                      onChange={(e) => updateItem(index, field.name, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}…`}
                      className="w-full rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-medium text-ink leading-relaxed outline-none focus:border-gold-dark"
                    />
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={(item[field.name] as string | number | undefined) ?? ""}
                      onChange={(e) =>
                        updateItem(
                          index,
                          field.name,
                          field.type === "number" ? Number(e.target.value) : e.target.value,
                        )
                      }
                      placeholder={field.label}
                      className="w-full rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-medium text-ink outline-none focus:border-gold-dark"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Photo preview for case studies and partner logos */}
            {(Boolean(item["beforeImage"]) || Boolean(item["afterImage"]) || Boolean(item["logo"])) && (
              <div className="flex items-center gap-3 pt-1 border-t border-line/60">
                {Boolean(item["beforeImage"]) && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-steel">Before:</span>
                    <img
                      src={String(item["beforeImage"])}
                      alt="Before"
                      className="h-9 w-14 object-cover rounded-lg border border-line"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                {Boolean(item["afterImage"]) && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-steel">After:</span>
                    <img
                      src={String(item["afterImage"])}
                      alt="After"
                      className="h-9 w-14 object-cover rounded-lg border border-line"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                {Boolean(item["logo"]) && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-steel">Logo:</span>
                    <img
                      src={String(item["logo"])}
                      alt="Partner Logo"
                      className="h-7 w-auto object-contain rounded border border-line bg-white p-1"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          onChange([
            ...items,
            Object.fromEntries(
              manifest.fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]),
            ),
          ])
        }
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-gold/50 bg-gold/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold-dark hover:bg-gold/15 transition-colors cursor-pointer"
      >
        <Plus size={14} />
        <span>Add Structured Item</span>
      </button>
    </div>
  );
}

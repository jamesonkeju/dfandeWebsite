import { useState, useMemo } from "react";
import {
  Mail,
  Phone,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  ExternalLink,
  Folder,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  useGetContactSubmissionsQuery,
  useUpdateContactSubmissionStatusMutation,
} from "@/features/contact/api/contactApi";
import { StatusBadge } from "@/features/admin/components/StatusBadge";

function CopyIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

const STATUS_FILTERS: Array<{ label: string; value: string }> = [
  { label: "All Inquiries", value: "ALL" },
  { label: "New", value: "New" },
  { label: "Read", value: "Read" },
  { label: "Responded", value: "Responded" },
  { label: "Archived", value: "Archived" },
];

export function ContactInboxPage() {
  const { data: submissions, isLoading, isError, refetch } = useGetContactSubmissionsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactSubmissionStatusMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: 0, New: 0, Read: 0, Responded: 0, Archived: 0 };
    if (!submissions) return counts;
    counts.ALL = submissions.length;
    for (const s of submissions) {
      if (counts[s.status] !== undefined) {
        counts[s.status]++;
      }
    }
    return counts;
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    return submissions.filter((s) => {
      const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q) ||
        s.message.toLowerCase().includes(q) ||
        (s.phone && s.phone.toLowerCase().includes(q)) ||
        (s.serviceOfInterest && s.serviceOfInterest.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [submissions, statusFilter, searchQuery]);

  // Pagination calculations
  const totalItems = filteredSubmissions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedItems = filteredSubmissions.slice(startIndex, startIndex + pageSize);

  const handleExportCsv = () => {
    if (!filteredSubmissions.length) return;
    const headers = ["ID", "Status", "Date", "Name", "Email", "Phone", "Subject", "ServiceOfInterest", "Message"];
    const rows = filteredSubmissions.map((s) => [
      s.id,
      s.status,
      new Date(s.createdAt).toISOString(),
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      `"${(s.phone || "").replace(/"/g, '""')}"`,
      `"${s.subject.replace(/"/g, '""')}"`,
      `"${(s.serviceOfInterest || "").replace(/"/g, '""')}"`,
      `"${s.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DFANDE_Contact_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-dark">
            <Mail size={15} />
            <span>Customer Inquiries &amp; Quotations</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-ink">Contact Submissions</h1>
          <p className="text-xs text-steel">
            Direct commercial inquiries, technical questions, and RFQ submissions from the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!filteredSubmissions.length}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink hover:border-gold-dark disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER TABS & SEARCH BAR */}
      <div className="rounded-2xl border border-line bg-white p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
          {STATUS_FILTERS.map((f) => {
            const count = statusCounts[f.value] ?? 0;
            const active = statusFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setStatusFilter(f.value);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-gold text-gold-ink shadow-xs"
                    : "bg-paper hover:bg-paper-raised text-ink-soft hover:text-ink"
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                    active ? "bg-gold-ink/15 text-gold-ink font-extrabold" : "bg-line text-steel"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by sender, email, subject, or service…"
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 pl-9 text-xs font-medium text-ink placeholder:text-steel focus:border-gold-dark focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2 text-xs text-steel">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-bold text-ink focus:border-gold-dark focus:outline-none cursor-pointer"
            >
              <option value={5}>5 per page</option>
              <option value={8}>8 per page</option>
              <option value={15}>15 per page</option>
              <option value={30}>30 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. COPIED TOAST NOTIFICATION */}
      {copiedField && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-void px-4 py-3 text-xs font-bold text-white shadow-2xl animate-fade-in border border-gold/30">
          <CheckCircle2 size={16} className="text-gold" />
          <span>Copied {copiedField} to clipboard!</span>
        </div>
      )}

      {/* 4. INQUIRIES LIST / ACCORDION TABLE */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-xs">
        {isLoading && (
          <div className="p-12 text-center text-sm text-steel space-y-2">
            <RefreshCw size={24} className="mx-auto animate-spin text-gold-dark" />
            <p>Loading inquiries inbox…</p>
          </div>
        )}

        {isError && (
          <div className="p-8 text-center text-sm text-danger space-y-2">
            <p className="font-bold">Failed to load contact submissions.</p>
            <p className="text-xs text-steel">Please ensure the backend API server is online and active.</p>
          </div>
        )}

        {!isLoading && !isError && totalItems === 0 && (
          <div className="p-12 text-center text-sm text-steel space-y-2">
            <Filter size={24} className="mx-auto text-steel/60" />
            <p className="font-bold text-ink">No inquiries match your filter criteria.</p>
            <p className="text-xs text-steel">Try selecting a different status tab or clearing the search query.</p>
          </div>
        )}

        {!isLoading && !isError && paginatedItems.length > 0 && (
          <div className="divide-y divide-line">
            {paginatedItems.map((s) => {
              const isExpanded = expandedId === s.id;
              const isNew = s.status === "New";

              return (
                <div key={s.id} className={`transition-colors ${isNew ? "bg-gold/5" : "hover:bg-paper/30"}`}>
                  {/* Collapsed Header Bar */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      <div className="mt-0.5 sm:mt-0 text-steel flex-none">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-sm font-bold truncate ${isNew ? "text-ink font-extrabold" : "text-ink"}`}>
                            {s.subject}
                          </span>
                          {s.serviceOfInterest && (
                            <span className="rounded-md bg-paper border border-line px-2 py-0.5 text-[10px] font-mono text-steel truncate max-w-[200px]">
                              {s.serviceOfInterest}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-steel">
                          <span className="font-semibold text-ink-soft">{s.name}</span>
                          <span>·</span>
                          <span className="font-mono">{s.email}</span>
                          {s.phone && (
                            <>
                              <span>·</span>
                              <span className="font-mono">{s.phone}</span>
                            </>
                          )}
                          <span>·</span>
                          <span>{new Date(s.createdAt).toLocaleDateString()} at {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <StatusBadge status={s.status} />
                    </div>
                  </div>

                  {/* Expanded Inquiry Detail Bay */}
                  {isExpanded && (
                    <div className="border-t border-line bg-paper/60 p-6 space-y-6">
                      {/* Sender Details Grid */}
                      <div className="grid gap-4 sm:grid-cols-3 rounded-xl border border-line bg-white p-4">
                        <div>
                          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-steel">Full Name</p>
                          <p className="mt-1 text-xs font-bold text-ink">{s.name}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-steel">Email Address</p>
                          <div className="mt-1 flex items-center gap-2">
                            <a
                              href={`mailto:${s.email}?subject=${encodeURIComponent("Re: " + s.subject)}`}
                              className="text-xs font-bold text-gold-dark hover:underline flex items-center gap-1 font-mono"
                            >
                              {s.email}
                              <ExternalLink size={12} />
                            </a>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(s.email, "email")}
                              title="Copy Email"
                              className="text-steel hover:text-ink cursor-pointer"
                            >
                              <CopyIcon size={12} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-steel">Phone Number</p>
                          <div className="mt-1 flex items-center gap-2">
                            {s.phone ? (
                              <>
                                <a
                                  href={`tel:${s.phone.replace(/\s+/g, '')}`}
                                  className="text-xs font-bold text-ink hover:text-gold-dark flex items-center gap-1 font-mono"
                                >
                                  <Phone size={12} className="text-steel" />
                                  {s.phone}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(s.phone ?? "", "phone number")}
                                  title="Copy Phone"
                                  className="text-steel hover:text-ink cursor-pointer"
                                >
                                  <CopyIcon size={12} />
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-steel italic">Not provided</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-steel">Message Content</p>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(s.message, "message body")}
                            className="flex items-center gap-1 text-[11px] font-bold text-steel hover:text-gold-dark cursor-pointer"
                          >
                            <CopyIcon size={12} />
                            <span>Copy Message</span>
                          </button>
                        </div>
                        <div className="rounded-xl border border-line bg-white p-5 text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans shadow-2xs">
                          {s.message}
                        </div>
                      </div>

                      {/* Bottom Workflow Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-line">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${s.email}?subject=${encodeURIComponent("Re: " + s.subject)}&body=${encodeURIComponent(
                              `Dear ${s.name},\n\nThank you for contacting Divine Flame and Energy International Limited regarding "${s.subject}".\n\n[Your message here]\n\nBest regards,\nDF&E Technical Team\ninfo@dfande.com\nwww.dfande.com\n\n--- Original Inquiry ---\nDate: ${new Date(s.createdAt).toLocaleString()}\n${s.message}`
                            )}`}
                            className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all cursor-pointer shadow-xs"
                          >
                            <Mail size={13} />
                            <span>Reply via Email Client</span>
                          </a>
                        </div>

                        {/* Status Change Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {s.status !== "Read" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => updateStatus({ id: s.id, status: "Read" })}
                              className="rounded-xl border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-ink hover:border-gold-dark hover:text-gold-dark disabled:opacity-50 transition-colors cursor-pointer"
                            >
                              Mark as Read
                            </button>
                          )}

                          {s.status !== "Responded" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => updateStatus({ id: s.id, status: "Responded" })}
                              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 size={13} className="text-emerald-600" />
                              <span>Mark as Responded</span>
                            </button>
                          )}

                          {s.status !== "Archived" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => updateStatus({ id: s.id, status: "Archived" })}
                              className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-steel hover:text-danger hover:border-danger disabled:opacity-50 transition-colors cursor-pointer"
                            >
                              <Folder size={13} />
                              <span>Archive</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 5. PAGINATION FOOTER */}
        {!isLoading && !isError && totalItems > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-line bg-paper/40 px-6 py-4">
            <div className="text-xs text-steel">
              Showing <span className="font-bold text-ink">{startIndex + 1}</span> to{" "}
              <span className="font-bold text-ink">{Math.min(startIndex + pageSize, totalItems)}</span> of{" "}
              <span className="font-bold text-ink">{totalItems}</span> submissions
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-ink hover:border-gold-dark disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-bold transition-all cursor-pointer ${
                    safePage === pg
                      ? "bg-gold text-gold-ink shadow-xs"
                      : "border border-line bg-white text-ink hover:border-gold-dark"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-ink hover:border-gold-dark disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


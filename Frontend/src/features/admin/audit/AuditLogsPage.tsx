import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/admin/auth/authSlice";
import {
  FileText,
  Search,
  RefreshCw,
  Clock,
  Eye,
  X,
  AlertCircle,
  Activity,
} from "lucide-react";

interface AuditItem {
  id: string;
  userId?: string;
  userEmail: string;
  userDisplayName: string;
  action: string;
  entityName: string;
  entityId?: string;
  detailsJson?: string;
  ipAddress?: string;
  timestampUtc: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export function AuditLogsPage() {
  const { token } = useSelector(selectAuth);
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<AuditItem | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.append("search", search);
      if (selectedAction) params.append("action", selectedAction);
      if (selectedEntity) params.append("entityName", selectedEntity);

      const res = await fetch(`${API_BASE}/auditlogs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load audit logs.");

      setLogs(data.data?.items || []);
      setTotalCount(data.data?.totalCount || 0);
    } catch (err: any) {
      setError(err.message || "Error retrieving audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token, page, selectedAction, selectedEntity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-dark">
            <Activity size={15} />
            <span>Compliance &amp; Security Trail</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-ink">System Audit Trail</h1>
          <p className="text-xs text-steel">
            Chronological record of user logins, content modifications, and access mutations.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink hover:border-gold-dark cursor-pointer shadow-xs"
        >
          <RefreshCw size={14} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-danger/10 p-4 text-xs font-semibold text-danger">
          <AlertCircle size={16} className="flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, action, entity, details keyword…"
              className="w-full rounded-xl border border-line bg-paper-raised py-2 pl-10 pr-4 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-line bg-paper-raised px-3 py-2 text-xs font-bold text-ink focus:border-gold-dark focus:outline-none"
            >
              <option value="">All Actions</option>
              <option value="AUTH_LOGIN_SUCCESS">Login Success</option>
              <option value="AUTH_LOGIN_FAILED">Login Failed</option>
              <option value="CREATE_SERVICE">Create Service</option>
              <option value="UPDATE_SERVICE">Update Service</option>
              <option value="DELETE_SERVICE">Delete Service</option>
              <option value="CREATE_PRODUCT">Create Product</option>
              <option value="UPDATE_PRODUCT">Update Product</option>
              <option value="CREATE_PROJECT">Create Project</option>
              <option value="UPDATE_PROJECT">Update Project</option>
              <option value="UPDATE_CONTENT_BLOCKS">Update Content</option>
              <option value="CREATE_USER">Create User</option>
              <option value="UPDATE_USER">Update User</option>
              <option value="ACTIVATE_USER">Activate User</option>
              <option value="DEACTIVATE_USER">Deactivate User</option>
              <option value="PASSWORD_CHANGED">Password Change</option>
            </select>

            <select
              value={selectedEntity}
              onChange={(e) => {
                setSelectedEntity(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-line bg-paper-raised px-3 py-2 text-xs font-bold text-ink focus:border-gold-dark focus:outline-none"
            >
              <option value="">All Entities</option>
              <option value="ApplicationUser">ApplicationUser</option>
              <option value="Service">Service</option>
              <option value="Product">Product</option>
              <option value="Project">Project</option>
              <option value="ContentBlock">ContentBlock</option>
              <option value="ContactSubmission">ContactSubmission</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all cursor-pointer"
            >
              Filter
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-xs font-mono text-steel pt-2 border-t border-line/60">
          <div>
            Showing <span className="text-gold-dark font-bold">{logs.length}</span> of {totalCount} Recorded Events
          </div>
          <div>Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}</div>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-paper-raised text-[11px] font-bold uppercase tracking-wider text-steel">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-steel">
                    Retrieving audit trail records…
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-steel">
                    No audit records matching criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isAuth = log.action.startsWith("AUTH");
                  const isDanger = log.action.includes("DELETE") || log.action.includes("FAILED") || log.action.includes("DEACTIVATE");
                  const isSuccess = log.action.includes("CREATE") || log.action.includes("SUCCESS") || log.action.includes("ACTIVATE");

                  const badgeClass = isDanger
                    ? "bg-danger/10 text-danger border-danger/20"
                    : isSuccess
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                    : isAuth
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-gold/15 text-gold-dark border-gold/30";

                  return (
                    <tr key={log.id} className="hover:bg-paper/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-[11px] text-steel whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-steel" />
                          <span>{new Date(log.timestampUtc).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-ink">{log.userDisplayName}</div>
                        <div className="font-mono text-[11px] text-steel truncate max-w-[200px]">
                          {log.userEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider ${badgeClass}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-ink">{log.entityName}</div>
                        {log.entityId && (
                          <div className="font-mono text-[10px] text-steel truncate max-w-[140px]">
                            {log.entityId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-steel whitespace-nowrap">
                        {log.ipAddress || "::1"}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setDetailModal(log)}
                          className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-[11px] font-bold text-steel hover:border-gold-dark hover:text-gold-dark transition-colors cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between border-t border-line bg-paper-raised px-6 py-4 text-xs font-medium text-steel">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-line bg-white px-3 py-1.5 font-bold hover:border-gold-dark disabled:opacity-40 cursor-pointer"
          >
            ← Previous
          </button>
          <div className="font-mono">
            Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}
          </div>
          <button
            type="button"
            disabled={page * pageSize >= totalCount}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-line bg-white px-3 py-1.5 font-bold hover:border-gold-dark disabled:opacity-40 cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>

      {/* INSPECT DETAIL MODAL */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-3xl border border-line bg-white p-6 md:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setDetailModal(null)}
              className="absolute right-5 top-5 text-steel hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Audit Event Payload</h3>
                <p className="text-xs text-steel font-mono">ID: {detailModal.id}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-line bg-paper-raised p-3">
                <span className="block font-bold text-steel uppercase text-[10px]">Action</span>
                <span className="font-mono font-bold text-ink">{detailModal.action}</span>
              </div>
              <div className="rounded-xl border border-line bg-paper-raised p-3">
                <span className="block font-bold text-steel uppercase text-[10px]">Target Entity</span>
                <span className="font-mono font-bold text-ink">{detailModal.entityName}</span>
              </div>
              <div className="rounded-xl border border-line bg-paper-raised p-3">
                <span className="block font-bold text-steel uppercase text-[10px]">Initiator</span>
                <span className="font-medium text-ink">{detailModal.userDisplayName} ({detailModal.userEmail})</span>
              </div>
              <div className="rounded-xl border border-line bg-paper-raised p-3">
                <span className="block font-bold text-steel uppercase text-[10px]">IP &amp; Timestamp</span>
                <span className="font-mono text-ink">
                  {detailModal.ipAddress} · {new Date(detailModal.timestampUtc).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                Details JSON Payload
              </label>
              <pre className="max-h-60 overflow-auto rounded-2xl border border-line bg-void p-4 font-mono text-xs text-emerald-400">
                {detailModal.detailsJson
                  ? JSON.stringify(JSON.parse(detailModal.detailsJson), null, 2)
                  : "// No extra payload attached"}
              </pre>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModal(null)}
                className="rounded-xl bg-gold px-6 py-2 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

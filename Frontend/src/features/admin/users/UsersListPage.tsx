import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/admin/auth/authSlice";
import {
  Plus,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw,
  Edit2,
  X,
} from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  isActive: boolean;
  lockoutEnabled: boolean;
  createdAtUtc: string;
}

const AVAILABLE_ROLES = [
  { value: "SuperAdmin", label: "Super Admin", description: "Unrestricted system access, user management, audit logs, and CMS publishing" },
  { value: "ContentManager", label: "Content Manager", description: "Manage Services, Products, Projects, Content Blocks, and respond to inquiries" },
  { value: "InquiryViewer", label: "Inquiry Viewer", description: "Read-only access to commercial contact submissions and dashboard metrics" },
];

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export function UsersListPage() {
  const { token } = useSelector(selectAuth);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [resetUser, setResetUser] = useState<UserItem | null>(null);

  // Create Form State
  const [newEmail, setNewEmail] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newRole, setNewRole] = useState("ContentManager");
  const [newPassword, setNewPassword] = useState("");

  // Edit Form State
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editRole, setEditRole] = useState("");

  // Reset Password State
  const [adminNewPassword, setAdminNewPassword] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load users.");
      setUsers(data.data || []);
    } catch (err: any) {
      setError(err.message || "Error loading user directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newEmail,
          displayName: newDisplayName,
          role: newRole,
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user.");

      setFeedback("User created successfully!");
      setCreateOpen(false);
      setNewEmail("");
      setNewDisplayName("");
      setNewPassword("");
      fetchUsers();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: editDisplayName,
          role: editRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user.");

      setFeedback("User updated successfully!");
      setEditUser(null);
      fetchUsers();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    try {
      setError(null);
      const nextStatus = !user.isActive;
      const res = await fetch(`${API_BASE}/users/${user.id}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user status.");

      setFeedback(`User ${user.email} is now ${nextStatus ? "Active" : "Deactivated"}.`);
      fetchUsers();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUser) return;
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/users/${resetUser.id}/admin-reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: adminNewPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password.");

      setFeedback(`Password for ${resetUser.email} was reset successfully!`);
      setResetUser(null);
      setAdminNewPassword("");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(term) ||
      u.displayName.toLowerCase().includes(term) ||
      u.roles.some((r) => r.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-dark">
            <Shield size={15} />
            <span>Governance &amp; Access Control</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-ink">User Directory &amp; Roles</h1>
          <p className="text-xs text-steel">Manage administrative staff, role permissions, and access privileges.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchUsers}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink hover:border-gold-dark cursor-pointer shadow-xs"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCreateOpen(true);
              setNewEmail("");
              setNewDisplayName("");
              setNewPassword("");
            }}
            className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all cursor-pointer shadow-sm"
          >
            <Plus size={15} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK & ERROR ALERTS */}
      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 size={16} className="flex-none text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-danger/10 p-4 text-xs font-semibold text-danger">
          <AlertCircle size={16} className="flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user email, display name, or role…"
            className="w-full rounded-xl border border-line bg-paper-raised py-2 pl-10 pr-4 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
          />
        </div>
        <div className="text-xs font-mono font-bold text-steel">
          Total: <span className="text-gold-dark">{filteredUsers.length}</span>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-paper-raised text-[11px] font-bold uppercase tracking-wider text-steel">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Assigned Role</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-steel">
                    Loading users directory…
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-steel">
                    No users matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuperAdmin = u.roles.includes("SuperAdmin");
                  const isContentMgr = u.roles.includes("ContentManager");
                  const roleBadgeClass = isSuperAdmin
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : isContentMgr
                    ? "bg-gold/15 text-gold-dark border-gold/30"
                    : "bg-blue-100 text-blue-800 border-blue-200";

                  return (
                    <tr key={u.id} className="hover:bg-paper/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-ink text-sm">{u.displayName}</div>
                        <div className="font-mono text-[11px] text-steel">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <span
                              key={r}
                              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleBadgeClass}`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className="flex items-center gap-1.5 font-bold cursor-pointer"
                        >
                          {u.isActive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 size={16} className="text-emerald-500" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-danger">
                              <X size={16} className="text-danger" />
                              <span>Deactivated</span>
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 font-mono text-steel">
                        {new Date(u.createdAtUtc).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditUser(u);
                              setEditDisplayName(u.displayName);
                              setEditRole(u.roles[0] || "ContentManager");
                            }}
                            className="rounded-lg border border-line p-2 text-steel hover:border-gold-dark hover:text-gold-dark transition-colors cursor-pointer"
                            title="Edit User Details"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setResetUser(u);
                              setAdminNewPassword("");
                            }}
                            className="rounded-lg border border-line p-2 text-steel hover:border-gold-dark hover:text-gold-dark transition-colors cursor-pointer"
                            title="Reset User Password"
                          >
                            <Lock size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-line bg-white p-6 md:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="absolute right-5 top-5 text-steel hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                <Plus size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Create New User</h3>
                <p className="text-xs text-steel">Add a new administrator to the portal</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  required
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. user@dfande.local"
                  className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                  Assigned Enterprise Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-bold text-ink focus:border-gold-dark focus:outline-none"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label} ({r.value})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="flex-1 rounded-xl border border-line py-2.5 text-xs font-bold text-steel hover:bg-paper cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gold py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all cursor-pointer shadow-xs"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-line bg-white p-6 md:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setEditUser(null)}
              className="absolute right-5 top-5 text-steel hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                <Edit2 size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Edit User Profile</h3>
                <p className="text-xs text-steel">{editUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateUser} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                  Role Assignment
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-bold text-ink focus:border-gold-dark focus:outline-none"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label} ({r.value})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="flex-1 rounded-xl border border-line py-2.5 text-xs font-bold text-steel hover:bg-paper cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gold py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all cursor-pointer shadow-xs"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN RESET PASSWORD MODAL */}
      {resetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-line bg-white p-6 md:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setResetUser(null)}
              className="absolute right-5 top-5 text-steel hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Reset User Password</h3>
                <p className="text-xs text-steel">Override credentials for {resetUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleAdminResetPassword} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setResetUser(null)}
                  className="flex-1 rounded-xl border border-line py-2.5 text-xs font-bold text-steel hover:bg-paper cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gold py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all cursor-pointer shadow-xs"
                >
                  Set Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

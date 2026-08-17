import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/admin/auth/authSlice";
import { X, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { token } = useSelector(selectAuth);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-3xl border border-line bg-white p-6 md:p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-steel hover:text-ink cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Change Password</h3>
            <p className="text-xs text-steel">Update your executive account credentials</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-danger/10 p-3 text-xs font-semibold text-danger">
            <AlertCircle size={15} className="flex-none" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={15} className="flex-none" />
            <span>Password updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
              Current Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
              New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
              placeholder="Min 8 chars with mix of letters & numbers"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
              Confirm New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
              placeholder="Re-type new password"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="flex items-center gap-1.5 text-xs text-steel hover:text-ink cursor-pointer"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showPass ? "Hide Passwords" : "Show Passwords"}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-line py-2.5 text-xs font-bold text-steel hover:bg-paper cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gold py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {loading ? "Updating..." : "Save Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

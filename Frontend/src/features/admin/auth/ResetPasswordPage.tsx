import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Logo } from "@/components/media/Logo";
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to reset password.");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/login", { replace: true });
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Logo height={34} />
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-paper-raised border border-line px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-dark">
            <Lock size={12} />
            Set New Password
          </span>
          <h1 className="mt-4 text-2xl font-bold text-ink">Reset Credentials</h1>
          <p className="mt-2 text-xs text-steel max-w-[32ch]">
            Choose a strong, unique password for your DF&E administrative account.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-danger/10 p-4 text-xs font-semibold text-danger">
            <AlertCircle size={16} className="flex-none" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-800">
            <CheckCircle2 size={16} className="flex-none text-emerald-600" />
            <span>Password reset successfully! Redirecting to sign in...</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="token" className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                Reset Token
              </label>
              <input
                id="token"
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token received in email"
                className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 font-mono text-xs text-ink focus:border-gold-dark focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type={showPass ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type={showPass ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2.5 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gold py-3 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {loading ? "Updating Password..." : "Set New Password"}
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-line pt-6 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-steel hover:text-ink transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/media/Logo";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Lock } from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setDevToken(null);

    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to process password reset request.");
      }

      setMessage(json.data?.message || "Password reset instructions have been dispatched.");
      if (json.data?.devToken) {
        setDevToken(json.data.devToken);
      }
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
            Password Recovery
          </span>
          <h1 className="mt-4 text-2xl font-bold text-ink">Forgot Password?</h1>
          <p className="mt-2 text-xs text-steel max-w-[32ch]">
            Enter your authorized administrative email address to receive secure reset instructions.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-danger/10 p-4 text-xs font-semibold text-danger">
            <AlertCircle size={16} className="flex-none" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mt-6 space-y-3 rounded-2xl bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="flex-none text-emerald-600" />
              <span>{message}</span>
            </div>
            {devToken && (
              <div className="mt-2 rounded-xl bg-white p-3 border border-emerald-200">
                <div className="text-[10px] uppercase font-mono text-steel">Development Reset Token:</div>
                <div className="font-mono text-xs break-all select-all font-bold text-ink mt-1">
                  {devToken}
                </div>
                <Link
                  to={`/admin/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(devToken)}`}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-gold-dark hover:underline"
                >
                  Click here to proceed with password reset →
                </Link>
              </div>
            )}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-steel mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dfande.local"
                  className="w-full rounded-xl border border-line bg-paper-raised py-2.5 pl-10 pr-4 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gold py-3 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {loading ? "Sending Instructions..." : "Send Reset Link"}
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

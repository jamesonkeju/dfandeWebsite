import { useState } from "react";
import { Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AlertCircle, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Logo } from "@/components/media/Logo";
import { Button } from "@/components/ui/Button";
import { useLoginMutation } from "./api/authApi";
import { setCredentials, selectIsAuthenticated } from "./authSlice";

const LoginSchema = Yup.object({
  email: Yup.string().email("Enter a valid email address.").required("Email is required."),
  password: Yup.string().required("Password is required."),
});

const DEMO_ACCOUNTS = [
  {
    role: "SuperAdmin",
    title: "Super Admin",
    email: "admin@dfande.local",
    password: "AdminPassword123!",
    badge: "Full Privilege",
  },
  {
    role: "ContentManager",
    title: "Content Manager",
    email: "editor@dfande.local",
    password: "EditorPassword123!",
    badge: "CMS Operations",
  },
  {
    role: "InquiryViewer",
    title: "Inquiry Viewer",
    email: "viewer@dfande.local",
    password: "ViewerPassword123!",
    badge: "Commercial Desk",
  },
];

export function LoginPage() {
  const [login] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/admin";
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo height={42} />
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-void px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-widest text-gold">
            <ShieldCheck size={13} />
            Enterprise CMS Portal
          </span>
        </div>

        <div className="rounded-3xl border border-line bg-white p-8 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-ink">Sign In</h1>
            <p className="mt-1 text-xs text-steel">Enter your administrative credentials to continue</p>
          </div>

          <Formik
            initialValues={{ email: "admin@dfande.local", password: "AdminPassword123!" }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setError(null);
              try {
                const result = await login(values).unwrap();
                dispatch(
                  setCredentials({
                    token: result.data.token,
                    displayName: result.data.displayName,
                    email: values.email,
                    roles: result.data.roles,
                  }),
                );
                navigate("/admin", { replace: true });
              } catch (err: any) {
                setError(err?.data?.message || "Invalid email, password, or deactivated account.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, setValues }) => (
              <Form className="mt-6 space-y-4" noValidate>
                {error && (
                  <div className="flex items-center gap-2 rounded-2xl border border-danger/30 bg-danger/10 p-3.5 text-xs font-semibold text-danger">
                    <AlertCircle size={16} className="flex-none" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-1 block text-xs font-bold uppercase tracking-wider text-steel">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      className="w-full rounded-xl border border-line bg-paper-raised py-2.5 pl-10 pr-4 text-xs font-medium text-ink outline-none focus:border-gold-dark"
                    />
                  </div>
                  <ErrorMessage name="email" component="p" className="mt-1 text-[11px] text-danger" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-steel">
                      Password
                    </label>
                    <Link
                      to="/admin/forgot-password"
                      className="text-[11px] font-bold text-gold-dark hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-line bg-paper-raised py-2.5 pl-10 pr-4 text-xs font-medium text-ink outline-none focus:border-gold-dark"
                    />
                  </div>
                  <ErrorMessage name="password" component="p" className="mt-1 text-[11px] text-danger" />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full justify-center rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  {isSubmitting ? "Authenticating…" : "Sign In to CMS"}
                </Button>

                {/* DEMO ROLE AUTO-FILL BUTTONS */}
                <div className="mt-6 border-t border-line pt-5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-steel">
                    <Sparkles size={13} className="text-gold-dark" />
                    <span>Quick Fill Demo Roles:</span>
                  </div>
                  <div className="mt-2.5 grid grid-cols-3 gap-2">
                    {DEMO_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => setValues({ email: acc.email, password: acc.password })}
                        className="rounded-xl border border-line bg-paper-raised p-2 text-left hover:border-gold-dark hover:bg-white transition-all cursor-pointer"
                      >
                        <div className="text-[11px] font-bold text-ink truncate">{acc.title}</div>
                        <div className="text-[9px] font-mono text-gold-dark truncate">{acc.badge}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

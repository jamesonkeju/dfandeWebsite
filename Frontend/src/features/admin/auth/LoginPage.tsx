import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Logo } from "@/components/media/Logo";
import { Button } from "@/components/ui/Button";
import { useLoginMutation } from "./api/authApi";
import { setCredentials, selectIsAuthenticated } from "./authSlice";

const LoginSchema = Yup.object({
  email: Yup.string().email("Enter a valid email address.").required("Email is required."),
  password: Yup.string().required("Password is required."),
});

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
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo height={40} />
        </div>

        <div className="rounded-2xl border border-line bg-white p-8">
          <p className="eyebrow text-gold-dark">CMS</p>
          <h1 className="mt-2 text-2xl font-bold text-ink">Sign In</h1>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setError(null);
              try {
                const result = await login(values).unwrap();
                dispatch(
                  setCredentials({
                    token: result.data.token,
                    displayName: result.data.displayName,
                    roles: result.data.roles,
                  }),
                );
                navigate("/admin", { replace: true });
              } catch {
                setError("Invalid email or password.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6 space-y-4" noValidate>
                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                    <AlertCircle size={16} className="flex-none" />
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                  />
                  <ErrorMessage name="email" component="p" className="mt-1 text-xs text-danger" />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                  />
                  <ErrorMessage name="password" component="p" className="mt-1 text-xs text-danger" />
                </div>

                <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full justify-center">
                  {isSubmitting ? "Signing in…" : "Sign In"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

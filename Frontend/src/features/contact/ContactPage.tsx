import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { CheckCircle2, Mail, MapPin, AlertCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/mock/company";
import { useGetPublishedServicesQuery } from "@/features/services/api/servicesApi";
import { useSubmitContactMutation, type ContactFormValues, type ApiErrorResponse } from "./api/contactApi";

// Mirrors the backend's FluentValidation rules (CreateContactSubmissionCommandValidator) —
// this is a UX convenience, not the authority; the API validates independently.
const ContactSchema = Yup.object({
  name: Yup.string().trim().required("Please enter your name.").max(200),
  email: Yup.string().trim().email("Enter a valid email address.").required("Please enter your email.").max(320),
  phone: Yup.string()
    .matches(/^[\d\s+\-()]*$/, "Phone must contain only digits and phone punctuation.")
    .max(30),
  subject: Yup.string().trim().required("Please enter a subject.").max(200),
  serviceOfInterest: Yup.string().max(200),
  message: Yup.string().trim().required("Please enter a message.").max(5000),
});

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  serviceOfInterest: "",
  message: "",
};

export function ContactPage() {
  const [submitContact, { isSuccess, data, reset }] = useSubmitContactMutation();
  const { data: services } = useGetPublishedServicesQuery();

  async function handleSubmit(
    values: ContactFormValues,
    { setSubmitting, setErrors, setStatus }: FormikHelpers<ContactFormValues>,
  ) {
    setStatus(undefined);
    try {
      await submitContact(values).unwrap();
    } catch (err) {
      const apiError = err as { data?: ApiErrorResponse };
      if (apiError.data?.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const [field, messages] of Object.entries(apiError.data.errors)) {
          const key = field.charAt(0).toLowerCase() + field.slice(1);
          fieldErrors[key] = messages[0];
        }
        setErrors(fieldErrors);
      } else {
        setStatus(apiError.data?.message ?? "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="py-20 md:py-28">
      <div className="max-w-[60ch]">
        <p className="eyebrow text-gold-dark">Contact Us</p>
        <h1 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
          Talk To <span className="highlight">DF&amp;E</span>
        </h1>
        <p className="mt-4 text-ink-soft">
          Tell us about your wellhead, Xmas tree or choke valve requirement and our team will get back
          to you.
        </p>
      </div>

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 flex-none text-gold-dark" size={20} />
            <div>
              <div className="text-sm font-bold text-ink">Email</div>
              <div className="text-sm text-ink-soft">info@dfande.com</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 flex-none text-gold-dark" size={20} />
            <div>
              <div className="text-sm font-bold text-ink">Locations</div>
              <div className="text-sm text-ink-soft">
                {company.headquarters} · Field facility: {company.fieldFacility}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="text-verify" size={40} />
              <h2 className="text-xl font-bold text-ink">Message sent</h2>
              <p className="max-w-[42ch] text-ink-soft">{data?.message}</p>
              <button
                type="button"
                onClick={() => reset()}
                className="mt-2 text-xs font-bold uppercase tracking-wide text-gold-dark"
              >
                Send another message
              </button>
            </div>
          ) : (
            <Formik initialValues={initialValues} validationSchema={ContactSchema} onSubmit={handleSubmit}>
              {({ isSubmitting, status }) => (
                <Form className="space-y-5" noValidate>
                  {status && (
                    <div className="flex items-start gap-2 rounded-lg border border-verify/30 bg-verify/10 p-3 text-sm text-ink">
                      <AlertCircle className="mt-0.5 flex-none text-verify" size={16} />
                      {status}
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                        Name
                      </label>
                      <Field
                        id="name"
                        name="name"
                        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                      />
                      <ErrorMessage name="name" component="p" className="mt-1 text-xs text-danger" />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                        Email
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                      />
                      <ErrorMessage name="email" component="p" className="mt-1 text-xs text-danger" />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                        Phone (optional)
                      </label>
                      <Field
                        id="phone"
                        name="phone"
                        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                      />
                      <ErrorMessage name="phone" component="p" className="mt-1 text-xs text-danger" />
                    </div>
                    <div>
                      <label htmlFor="serviceOfInterest" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                        Service of Interest (optional)
                      </label>
                      <Field
                        id="serviceOfInterest"
                        name="serviceOfInterest"
                        as="select"
                        className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                      >
                        <option value="">Select a service</option>
                        {(services ?? []).map((s) => (
                          <option key={s.slug} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                      Subject
                    </label>
                    <Field
                      id="subject"
                      name="subject"
                      className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                    />
                    <ErrorMessage name="subject" component="p" className="mt-1 text-xs text-danger" />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                      Message
                    </label>
                    <Field
                      id="message"
                      name="message"
                      as="textarea"
                      rows={5}
                      className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                    />
                    <ErrorMessage name="message" component="p" className="mt-1 text-xs text-danger" />
                  </div>

                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? "Sending…" : "Send Message"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </Container>
  );
}

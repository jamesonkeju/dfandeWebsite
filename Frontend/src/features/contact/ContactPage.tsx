import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { CheckCircle, Mail, Phone, Building2, Wrench, MapPin, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { useGetPublishedServicesQuery } from "@/features/services/api/servicesApi";
import { useSubmitContactMutation, type ContactFormValues, type ApiErrorResponse } from "./api/contactApi";
import { useContent } from "@/features/content/hooks/useContent";

const ContactSchema = Yup.object({
  name: Yup.string().trim().required("Please enter your name.").max(200),
  email: Yup.string().trim().email("Please enter a valid email address.").required("Email address is required.").max(320),
  phone: Yup.string()
    .matches(/^[\d\s+\-()]*$/, "Please enter a valid phone number.")
    .max(30),
  subject: Yup.string().trim().required("Please provide a subject for your inquiry.").max(200),
  serviceOfInterest: Yup.string().max(200),
  message: Yup.string().trim().required("Please write your message.").max(5000),
});

export function ContactPage() {
  const [submitContact, { isSuccess, data, reset, isLoading }] = useSubmitContactMutation();
  const { data: services } = useGetPublishedServicesQuery();
  const { getText, getList } = useContent();

  const contactEmail = getText("company.contactEmail", "info@dfande.com");
  const hqAddress = getText("company.headquartersAddress", "Plot 12 Commercial Block, Victoria Island, Lagos, Nigeria");
  const facilityAddress = getText("company.facilityAddress", "KM 20, Aba Port-Harcourt Express Way, By Timber Bus Stop, Oyigbo, Port-Harcourt, Nigeria");
  const phones = getList("company.contactPhones");
  const phoneList = phones.length > 0 ? phones : [
    "+234 810 500 0092 / 93",
    "+234 812 904 3200",
    "+234 803 301 9612",
  ];

  const initialValues: ContactFormValues = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    serviceOfInterest: "",
    message: "",
  };

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
        setStatus(apiError.data?.message ?? "An error occurred while submitting your message. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact DF&E"
        title="Get in Touch with Our Team"
        description="Contact our Lagos corporate office or our Port Harcourt field engineering & warehousing facility for technical inquiries, RFQs, and 24/7 field mobilization."
      />

      <Container className="py-16 md:py-20 max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* LEFT: SOLID CORPORATE ADDRESS & CONTACT INFO */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-ink">Office &amp; Facility Locations</h2>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                Headquartered in Lagos with our full-service engineering hub and warehousing facility in Port Harcourt.
              </p>
            </div>

            <div className="space-y-6">
              {/* Port Harcourt Operations Facility (Primary Workshop) */}
              <div className="flex items-start gap-4 rounded-xl border border-line bg-paper-raised p-4">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white border border-line text-gold-dark shadow-xs">
                  <Wrench size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-ink">Port Harcourt Field Facility</h3>
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-ink uppercase font-mono">Main Base</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft leading-relaxed font-medium">{facilityAddress}</p>
                  <p className="mt-1 text-xs text-steel">1,500m² Workshop · 30,000psi Testing Bunkers · Spares Hub</p>
                </div>
              </div>

              {/* Lagos HQ */}
              <div className="flex items-start gap-4 rounded-xl border border-line bg-white p-4">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-paper-raised border border-line text-gold-dark shadow-xs">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Lagos Headquarters</h3>
                  <p className="mt-1 text-xs text-ink-soft leading-relaxed font-medium">{hqAddress}</p>
                  <p className="mt-1 text-xs text-steel">Monday – Friday: 8:00 AM – 5:00 PM WAT</p>
                </div>
              </div>

              {/* Direct Lines & Email */}
              <div className="pt-2 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gold-dark flex-none mt-1" />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-steel font-mono">Direct Lines:</span>
                    <div className="mt-1 flex flex-col gap-1 text-xs font-semibold text-ink">
                      {phoneList.map((ph) => (
                        <a
                          key={ph}
                          href={`tel:${ph.replace(/[^\d+]/g, "")}`}
                          className="hover:text-gold-dark transition-colors"
                        >
                          {ph}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-line/60">
                  <Mail size={16} className="text-gold-dark flex-none" />
                  <a href={`mailto:${contactEmail}`} className="text-xs font-bold text-ink hover:text-gold-dark transition-colors">
                    {contactEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CLEAN CORPORATE INQUIRY FORM */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-line bg-white p-8 md:p-10 shadow-sm">
              {isSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle className="mx-auto text-verify" size={48} />
                  <h2 className="text-2xl font-bold text-ink">Thank You</h2>
                  <p className="mx-auto max-w-md text-sm text-ink-soft leading-relaxed">
                    {data?.message ?? "Your message has been received. A member of our technical team will review your inquiry and get back to you shortly."}
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => reset()}
                      className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <Formik initialValues={initialValues} validationSchema={ContactSchema} onSubmit={handleSubmit}>
                  {({ isSubmitting, status }) => (
                    <Form className="space-y-5" noValidate>
                      <div>
                        <h2 className="text-lg font-bold text-ink">Send Us a Message</h2>
                        <p className="mt-1 text-xs text-ink-soft">
                          Please complete the form below and our team will respond to your request.
                        </p>
                      </div>

                      {status && (
                        <div className="rounded-lg bg-danger/10 border border-danger/20 p-3 text-xs text-danger">
                          {status}
                        </div>
                      )}

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="mb-1 block text-xs font-bold text-ink">
                            Your Name <span className="text-danger">*</span>
                          </label>
                          <Field
                            id="name"
                            name="name"
                            placeholder="Full name"
                            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-dark"
                          />
                          <ErrorMessage name="name" component="p" className="mt-1 text-xs text-danger" />
                        </div>

                        <div>
                          <label htmlFor="email" className="mb-1 block text-xs font-bold text-ink">
                            Email Address <span className="text-danger">*</span>
                          </label>
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-dark"
                          />
                          <ErrorMessage name="email" component="p" className="mt-1 text-xs text-danger" />
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="phone" className="mb-1 block text-xs font-bold text-ink">
                            Phone Number
                          </label>
                          <Field
                            id="phone"
                            name="phone"
                            placeholder="Optional phone number"
                            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-dark"
                          />
                          <ErrorMessage name="phone" component="p" className="mt-1 text-xs text-danger" />
                        </div>

                        <div>
                          <label htmlFor="serviceOfInterest" className="mb-1 block text-xs font-bold text-ink">
                            Service Area
                          </label>
                          <Field
                            id="serviceOfInterest"
                            name="serviceOfInterest"
                            as="select"
                            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-dark"
                          >
                            <option value="">Select a service (optional)</option>
                            {(services ?? []).map((s) => (
                              <option key={s.slug} value={s.title}>
                                {s.title}
                              </option>
                            ))}
                            <option value="Product Sourcing & Procurement">Product Sourcing &amp; Procurement</option>
                            <option value="General Inquiry">General Inquiry</option>
                          </Field>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="mb-1 block text-xs font-bold text-ink">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <Field
                          id="subject"
                          name="subject"
                          placeholder="Brief summary of your requirement"
                          className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-dark"
                        />
                        <ErrorMessage name="subject" component="p" className="mt-1 text-xs text-danger" />
                      </div>

                      <div>
                        <label htmlFor="message" className="mb-1 block text-xs font-bold text-ink">
                          Message <span className="text-danger">*</span>
                        </label>
                        <Field
                          id="message"
                          name="message"
                          as="textarea"
                          rows={4}
                          placeholder="Please provide details regarding equipment, service scope, or project timeline..."
                          className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold-dark"
                        />
                        <ErrorMessage name="message" component="p" className="mt-1 text-xs text-danger" />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className="w-full rounded-lg bg-gold px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light disabled:opacity-50 transition-colors"
                        >
                          {isSubmitting || isLoading ? "Sending Message..." : "Submit Inquiry"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>

        {/* MAP & DIRECTIONS SECTION */}
        <div className="mt-16 border-t border-line pt-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-gold-dark font-mono text-xs font-bold uppercase tracking-widest">
                <MapPin size={15} />
                <span>Facility Map Location</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-ink">Find Our Port Harcourt Engineering Hub</h2>
              <p className="mt-1 text-xs text-ink-soft">
                KM 20, Aba Port-Harcourt Express Way, By Timber Bus Stop, Oyigbo, Port-Harcourt, Rivers State, Nigeria.
              </p>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=KM+20+Aba+Port-Harcourt+Express+Way+Timber+Bus+Stop+Oyigbo+Port+Harcourt+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink hover:border-gold-dark hover:text-gold-dark shadow-xs transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line shadow-sm bg-paper aspect-[16/7] min-h-[320px] relative">
            <iframe
              title="Divine Flame and Energy Port Harcourt Facility Location Map"
              src="https://maps.google.com/maps?q=Timber+Bus+Stop+Oyigbo+Port+Harcourt+Nigeria&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </Container>
    </>
  );
}

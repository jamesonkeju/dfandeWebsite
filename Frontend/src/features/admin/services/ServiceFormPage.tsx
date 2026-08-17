import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  type ServiceFormValues,
} from "@/features/services/api/servicesApi";
import { StringListField } from "@/components/forms/StringListField";

const ICON_OPTIONS = ["flame", "gauge", "settings", "anchor", "droplet", "shield", "lock", "package"];

const ServiceSchema = Yup.object({
  title: Yup.string().trim().required("Title is required.").max(200),
  slug: Yup.string()
    .trim()
    .required("Slug is required.")
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase, alphanumeric, hyphen-separated (e.g. 'choke-valve')."),
  summary: Yup.string().trim().required("Summary is required.").max(500),
  icon: Yup.string().required(),
  imageUrl: Yup.string().max(500),
  displayOrder: Yup.number().min(0).required(),
  scope: Yup.array().of(Yup.string().trim().required("Scope items can't be empty.")),
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ServiceFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: services } = useGetAllServicesQuery();
  const existing = isEditing ? services?.find((s) => s.id === id) : undefined;

  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();

  if (isEditing && !existing) {
    return <p className="text-sm text-ink-soft">Loading…</p>;
  }

  const initialValues: ServiceFormValues = existing
    ? {
        title: existing.title,
        slug: existing.slug,
        summary: existing.summary,
        scope: existing.scope,
        icon: existing.icon,
        imageUrl: existing.imageUrl ?? "",
        displayOrder: existing.displayOrder,
        isFeatured: existing.isFeatured,
        isPublished: existing.isPublished,
      }
    : {
        title: "",
        slug: "",
        summary: "",
        scope: [""],
        icon: "flame",
        imageUrl: "",
        displayOrder: services?.length ?? 0,
        isFeatured: false,
        isPublished: false,
      };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-ink">{isEditing ? "Edit Service" : "New Service"}</h1>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ServiceSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const payload = { ...values, scope: values.scope.filter((s) => s.trim().length > 0) };
          if (isEditing && id) {
            await updateService({ id, ...payload });
          } else {
            await createService(payload);
          }
          setSubmitting(false);
          navigate("/admin/services");
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="mt-6 space-y-5" noValidate>
            <div>
              <label htmlFor="title" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                Title
              </label>
              <Field
                id="title"
                name="title"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("title", e.target.value);
                  if (!isEditing) setFieldValue("slug", slugify(e.target.value));
                }}
              />
              <ErrorMessage name="title" component="p" className="mt-1 text-xs text-danger" />
            </div>

            <div>
              <label htmlFor="slug" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                Slug
              </label>
              <Field
                id="slug"
                name="slug"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm font-mono outline-none focus:border-gold-dark"
              />
              <ErrorMessage name="slug" component="p" className="mt-1 text-xs text-danger" />
            </div>

            <div>
              <label htmlFor="summary" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                Summary
              </label>
              <Field
                id="summary"
                name="summary"
                as="textarea"
                rows={2}
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
              />
              <ErrorMessage name="summary" component="p" className="mt-1 text-xs text-danger" />
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">Scope</span>
              <StringListField name="scope" values={values.scope} />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label htmlFor="icon" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                  Icon
                </label>
                <Field
                  id="icon"
                  name="icon"
                  as="select"
                  className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label htmlFor="displayOrder" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                  Display Order
                </label>
                <Field
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                />
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                Image URL (optional — featured services only)
              </label>
              <Field
                id="imageUrl"
                name="imageUrl"
                placeholder="/images/service-example.png"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm font-mono outline-none focus:border-gold-dark"
              />
              <p className="mt-1 text-xs text-steel">
                No media library yet — paste a path to an existing asset. A real upload flow is a separate piece of work.
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink">
              <Field type="checkbox" name="isFeatured" className="h-4 w-4 rounded border-line" />
              Featured (shown as a large photo card, not the compact list)
            </label>

            {!isEditing && (
              <label className="flex items-center gap-2 text-sm text-ink">
                <Field type="checkbox" name="isPublished" className="h-4 w-4 rounded border-line" />
                Publish immediately
              </label>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-gold-ink hover:bg-gold-dark disabled:opacity-50"
              >
                {isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Create Service"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/services")}
                className="rounded-full border border-line px-6 py-2.5 text-sm font-bold text-ink-soft hover:border-gold-dark hover:text-gold-dark"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

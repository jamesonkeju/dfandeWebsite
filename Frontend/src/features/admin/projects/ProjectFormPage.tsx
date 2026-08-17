import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  type ProjectFormValues,
} from "@/features/projects/api/projectsApi";

const CATEGORY_OPTIONS = [
  { value: "wellhead", label: "Wellhead & Xmas Tree" },
  { value: "control-panel", label: "Control Panel" },
  { value: "choke-valve", label: "Choke Valve" },
];

const ProjectSchema = Yup.object({
  client: Yup.string().trim().required("Client is required.").max(200),
  scope: Yup.string().trim().required("Scope is required.").max(500),
  location: Yup.string().trim().required("Location is required.").max(200),
  year: Yup.string().trim().required("Year is required.").max(50),
  category: Yup.string().required(),
  displayOrder: Yup.number().min(0).required(),
});

export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: projects } = useGetAllProjectsQuery();
  const existing = isEditing ? projects?.find((p) => p.id === id) : undefined;

  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  if (isEditing && !existing) {
    return <p className="text-sm text-ink-soft">Loading…</p>;
  }

  const initialValues: ProjectFormValues = existing
    ? {
        client: existing.client,
        scope: existing.scope,
        location: existing.location,
        year: existing.year,
        category: existing.category,
        imageUrl: existing.imageUrl ?? "",
        displayOrder: existing.displayOrder,
        isFeatured: existing.isFeatured,
        isPublished: existing.isPublished,
      }
    : {
        client: "",
        scope: "",
        location: "",
        year: "",
        category: "wellhead",
        imageUrl: "",
        displayOrder: projects?.length ?? 0,
        isFeatured: false,
        isPublished: false,
      };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-ink">{isEditing ? "Edit Project" : "New Project"}</h1>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ProjectSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (isEditing && id) {
            await updateProject({ id, ...values });
          } else {
            await createProject(values);
          }
          setSubmitting(false);
          navigate("/admin/projects");
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mt-6 space-y-5" noValidate>
            <div>
              <label htmlFor="client" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                Client
              </label>
              <Field
                id="client"
                name="client"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
              />
              <ErrorMessage name="client" component="p" className="mt-1 text-xs text-danger" />
            </div>

            <div>
              <label htmlFor="scope" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                Scope
              </label>
              <Field
                id="scope"
                name="scope"
                as="textarea"
                rows={2}
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
              />
              <ErrorMessage name="scope" component="p" className="mt-1 text-xs text-danger" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="location"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel"
                >
                  Location
                </label>
                <Field
                  id="location"
                  name="location"
                  className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                />
                <ErrorMessage name="location" component="p" className="mt-1 text-xs text-danger" />
              </div>
              <div>
                <label htmlFor="year" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                  Year (free text, e.g. "2015 – till date")
                </label>
                <Field
                  id="year"
                  name="year"
                  className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                />
                <ErrorMessage name="year" component="p" className="mt-1 text-xs text-danger" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel"
                >
                  Category
                </label>
                <Field
                  id="category"
                  name="category"
                  as="select"
                  className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label
                  htmlFor="displayOrder"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel"
                >
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
                Image URL (optional)
              </label>
              <Field
                id="imageUrl"
                name="imageUrl"
                placeholder="/images/project-example.jpg"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm font-mono outline-none focus:border-gold-dark"
              />
              <p className="mt-1 text-xs text-steel">
                No media library yet — paste a path to an existing asset. A real upload flow is a separate piece of work.
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink">
              <Field type="checkbox" name="isFeatured" className="h-4 w-4 rounded border-line" />
              Featured (shown in the homepage's Featured Projects section)
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
                {isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Create Project"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/projects")}
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

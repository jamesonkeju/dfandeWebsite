import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  type ProductFormValues,
} from "@/features/products/api/productsApi";
import { StringListField } from "@/components/forms/StringListField";

const ProductSchema = Yup.object({
  title: Yup.string().trim().required("Title is required.").max(200),
  slug: Yup.string()
    .trim()
    .required("Slug is required.")
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase, alphanumeric, hyphen-separated (e.g. 'wellhead-equipment')."),
  application: Yup.string().max(300),
  displayOrder: Yup.number().min(0).required(),
  items: Yup.array().of(Yup.string().trim().required("Items can't be empty.")),
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: products } = useGetAllProductsQuery();
  const existing = isEditing ? products?.find((p) => p.id === id) : undefined;

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  if (isEditing && !existing) {
    return <p className="text-sm text-ink-soft">Loading…</p>;
  }

  const initialValues: ProductFormValues = existing
    ? {
        title: existing.title,
        slug: existing.slug,
        items: existing.items,
        application: existing.application ?? "",
        imageUrl: existing.imageUrl ?? "",
        displayOrder: existing.displayOrder,
        isPublished: existing.isPublished,
      }
    : {
        title: "",
        slug: "",
        items: [""],
        application: "",
        imageUrl: "",
        displayOrder: products?.length ?? 0,
        isPublished: false,
      };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-ink">{isEditing ? "Edit Product" : "New Product"}</h1>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ProductSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const payload = { ...values, items: values.items.filter((s) => s.trim().length > 0) };
          if (isEditing && id) {
            await updateProduct({ id, ...payload });
          } else {
            await createProduct(payload);
          }
          setSubmitting(false);
          navigate("/admin/products");
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
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">Items</span>
              <StringListField name="items" values={values.items} />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="application"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel"
                >
                  Application (optional)
                </label>
                <Field
                  id="application"
                  name="application"
                  className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-gold-dark"
                />
                <ErrorMessage name="application" component="p" className="mt-1 text-xs text-danger" />
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
                placeholder="/images/product-example.jpg"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm font-mono outline-none focus:border-gold-dark"
              />
              <p className="mt-1 text-xs text-steel">
                No media library yet — paste a path to an existing asset. A real upload flow is a separate piece of work.
              </p>
            </div>

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
                {isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Create Product"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
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

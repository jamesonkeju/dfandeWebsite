import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Package,
  Sparkles,
  Eye,
  X,
} from "lucide-react";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  type ProductFormValues,
} from "@/features/products/api/productsApi";
import { StringListField } from "@/components/forms/StringListField";

const PRODUCT_PRESET_IMAGES = [
  { url: "/images/product-wellhead-equipment.jpg", label: "Wellhead & Xmas Tree Assemblies" },
  { url: "/images/product-chokes-valves.jpg", label: "Choke & Control Valves Heavy Body" },
  { url: "/images/product-control-panel.jpg", label: "Pneumatic / Hydraulic Wellhead Panels" },
  { url: "/images/product-mro-spares.jpg", label: "MRO Spare Parts & Seals Kit" },
  { url: "/images/product-mudline.jpg", label: "Mudline Suspension & Running Tools" },
  { url: "/images/services/procurement-octg.png", label: "OCTG Casing, Tubing & Line Pipes" },
  { url: "/images/services/procurement-flowmeters.png", label: "Custody Transfer & Coriolis Meters" },
  { url: "/images/services/valve-assembly-flange.png", label: "Forged API 6A Flanges & Gate Valves" },
  { url: "/images/services/whcp-pneumatics.png", label: "Subsea Wellhead WHCP Logic Modules" },
];

const ProductSchema = Yup.object({
  title: Yup.string().trim().required("Title is required.").max(200),
  slug: Yup.string()
    .trim()
    .required("Slug is required.")
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase, alphanumeric, hyphen-separated (e.g. 'wellhead-equipment')."),
  application: Yup.string().max(300),
  displayOrder: Yup.number().min(0).required(),
  items: Yup.array().of(Yup.string().trim().required("Component item cannot be empty.")),
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

  const { data: products, isLoading } = useGetAllProductsQuery();
  const existing = isEditing ? products?.find((p) => p.id === id) : undefined;

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [presetModalOpen, setPresetModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isEditing && isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-steel">
        Loading product details…
      </div>
    );
  }

  const initialValues: ProductFormValues = existing
    ? {
        title: existing.title,
        slug: existing.slug,
        items: existing.items.length > 0 ? existing.items : ["API 6A Surface Wellhead Assemblies"],
        application: existing.application ?? "",
        imageUrl: existing.imageUrl ?? "/images/product-wellhead-equipment.jpg",
        displayOrder: existing.displayOrder,
        isPublished: existing.isPublished,
      }
    : {
        title: "",
        slug: "",
        items: ["Standard API 6A Spec Equipment", "Hydrostatic Certification to 15,000 psi"],
        application: "High-pressure oil & gas extraction and surface flow control.",
        imageUrl: "/images/product-wellhead-equipment.jpg",
        displayOrder: (products?.length ?? 0) + 1,
        isPublished: true,
      };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-steel hover:text-ink transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Products</span>
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-ink">
            {isEditing ? `Edit: ${existing?.title ?? "Product"}` : "Add New Product"}
          </h1>
          <p className="text-xs text-steel">
            Configure product equipment specifications, bill of materials, and visual catalog cards.
          </p>
        </div>
      </div>

      {submitError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4 text-xs font-bold text-danger">
          {submitError}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ProductSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitError(null);
            const payload = {
              ...values,
              items: values.items.filter((s) => s.trim().length > 0),
            };

            if (isEditing && id) {
              await updateProduct({ id, ...payload }).unwrap();
            } else {
              await createProduct(payload).unwrap();
            }

            setSubmitting(false);
            navigate("/admin/products");
          } catch (err: any) {
            setSubmitting(false);
            setSubmitError(err?.data?.message || err?.message || "Failed to save product. Please try again.");
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const currentImg = values.imageUrl || "/images/product-wellhead-equipment.jpg";

          return (
            <Form className="grid grid-cols-1 gap-8 lg:grid-cols-12" noValidate>
              {/* Left Column: Form Fields */}
              <div className="space-y-6 lg:col-span-7">
                <div className="space-y-5 rounded-3xl border border-line bg-white p-6 shadow-2xs">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3">
                    Product Package Details
                  </h2>

                  {/* Title & Slug */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-steel">
                        Product Title <span className="text-danger">*</span>
                      </label>
                      <Field
                        id="title"
                        name="title"
                        placeholder="e.g. Wellhead & Xmas Tree Equipment"
                        className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-xs font-semibold text-ink outline-none focus:border-gold-dark focus:bg-white"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("title", e.target.value);
                          if (!isEditing) setFieldValue("slug", slugify(e.target.value));
                        }}
                      />
                      <ErrorMessage name="title" component="p" className="mt-1 text-[11px] text-danger" />
                    </div>

                    <div>
                      <label htmlFor="slug" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-steel">
                        URL Slug <span className="text-danger">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-mono text-steel">/products#</span>
                        <Field
                          id="slug"
                          name="slug"
                          placeholder="wellhead-equipment"
                          className="w-full rounded-xl border border-line bg-paper-raised py-2.5 pl-24 pr-4 font-mono text-xs font-semibold text-ink outline-none focus:border-gold-dark focus:bg-white"
                        />
                      </div>
                      <ErrorMessage name="slug" component="p" className="mt-1 text-[11px] text-danger" />
                    </div>
                  </div>

                  {/* Application Scope */}
                  <div>
                    <label htmlFor="application" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-steel">
                      Operational Application & Context
                    </label>
                    <Field
                      id="application"
                      name="application"
                      as="textarea"
                      rows={3}
                      placeholder="e.g. High-pressure surface production, subsea completions, and offshore injection manifolds."
                      className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-xs font-medium text-ink leading-relaxed outline-none focus:border-gold-dark focus:bg-white"
                    />
                    <ErrorMessage name="application" component="p" className="mt-1 text-[11px] text-danger" />
                  </div>

                  {/* Display Order */}
                  <div>
                    <label htmlFor="displayOrder" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-steel">
                      Display Priority Order
                    </label>
                    <Field
                      id="displayOrder"
                      name="displayOrder"
                      type="number"
                      className="w-32 rounded-xl border border-line bg-paper-raised px-4 py-2 text-xs font-mono font-bold text-ink outline-none focus:border-gold-dark focus:bg-white"
                    />
                    <p className="mt-1 text-[11px] text-steel">Lower numbers appear first on the public website.</p>
                  </div>
                </div>

                {/* Items / Component Specification Builder */}
                <div className="space-y-4 rounded-3xl border border-line bg-white p-6 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
                        Equipment Bill of Materials (BOM)
                      </h2>
                      <p className="text-xs text-steel">Add all deliverables, components, and certification scopes.</p>
                    </div>
                    <span className="rounded-full bg-paper px-2.5 py-0.5 font-mono text-xs font-bold text-steel">
                      {values.items.filter((i) => i.trim()).length} Items
                    </span>
                  </div>

                  <StringListField name="items" values={values.items} />
                </div>

                {/* Publishing Options */}
                <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3 mb-4">
                    Visibility & Publishing
                  </h2>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <Field
                      type="checkbox"
                      name="isPublished"
                      className="h-5 w-5 rounded-lg border-line text-gold focus:ring-gold"
                    />
                    <div>
                      <div className="text-xs font-bold text-ink">Publish on Public Website</div>
                      <div className="text-[11px] text-steel">
                        When checked, this product package will be visible to all customers on `/products`.
                      </div>
                    </div>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-gold py-3 text-xs font-bold uppercase tracking-wider text-gold-ink shadow-sm transition-all hover:bg-gold-light disabled:opacity-50 cursor-pointer text-center"
                  >
                    {isSubmitting ? "Saving Product…" : isEditing ? "Save Changes" : "Create Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/products")}
                    className="rounded-xl border border-line px-6 py-3 text-xs font-bold text-steel hover:bg-paper cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Right Column: Image Preview Bay & Card Simulator */}
              <div className="space-y-6 lg:col-span-5">
                {/* Image Bay */}
                <div className="space-y-4 rounded-3xl border border-line bg-white p-6 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={16} className="text-gold-dark" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-ink">Product Image Asset</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="flex items-center gap-1 text-[11px] font-bold text-gold-dark hover:underline cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>Full Size</span>
                    </button>
                  </div>

                  {/* Canvas */}
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-inner group">
                    <img
                      src={currentImg}
                      alt="Product Banner Preview"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/product-wellhead-equipment.jpg";
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                      <p className="font-mono text-[10px] truncate text-white/90">{currentImg}</p>
                    </div>
                  </div>

                  {/* Actions: Presets & Local Dropzone */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPresetModalOpen(true)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gold/15 px-3 py-2.5 text-xs font-bold text-gold-dark hover:bg-gold/25 transition-colors cursor-pointer"
                    >
                      <Sparkles size={14} />
                      <span>Choose Preset</span>
                    </button>

                    <label className="flex items-center justify-center gap-2 rounded-xl border border-line bg-paper-raised px-3 py-2.5 text-xs font-bold text-ink hover:border-gold-dark hover:bg-white transition-colors cursor-pointer">
                      <Upload size={14} className="text-steel" />
                      <span>Upload Local</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setFieldValue("imageUrl", event.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Manual Path Input */}
                  <div>
                    <label htmlFor="imageUrl" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-steel">
                      Image Path URL
                    </label>
                    <Field
                      id="imageUrl"
                      name="imageUrl"
                      placeholder="/images/product-wellhead-equipment.jpg"
                      className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2 font-mono text-xs text-ink outline-none focus:border-gold-dark focus:bg-white"
                    />
                  </div>
                </div>

                {/* Live Public Card Simulator */}
                <div className="space-y-3 rounded-3xl border border-line bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-line pb-3">
                    <Package size={15} className="text-gold-dark" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-steel">
                      Live Public Card Simulator
                    </h3>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                    <div className="relative aspect-16/9 w-full bg-paper-raised">
                      <img
                        src={currentImg}
                        alt="Simulator"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/product-wellhead-equipment.jpg";
                        }}
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-ink text-sm">
                        {values.title || "Product Package Title"}
                      </h4>
                      <p className="text-xs text-steel line-clamp-2">
                        {values.application || "Operational application summary."}
                      </p>
                      <div className="pt-2 border-t border-line space-y-1">
                        <span className="text-[10px] font-bold uppercase text-steel">Components:</span>
                        <div className="flex flex-wrap gap-1">
                          {values.items.filter((i) => i.trim()).slice(0, 3).map((it, idx) => (
                            <span key={idx} className="rounded bg-paper px-1.5 py-0.5 text-[10px] font-medium text-ink">
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRESET ASSET PICKER MODAL */}
              {presetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4 backdrop-blur-xs">
                  <div className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between border-b border-line pb-4">
                      <div>
                        <h3 className="text-base font-bold text-ink">Choose Product Asset Preset</h3>
                        <p className="text-xs text-steel">Select an authentic DF&amp;E product photograph from the media library</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPresetModalOpen(false)}
                        className="rounded-lg p-1 text-steel hover:text-ink cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto p-2 my-4 max-h-[55vh]">
                      {PRODUCT_PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => {
                            setFieldValue("imageUrl", preset.url);
                            setPresetModalOpen(false);
                          }}
                          className={`group relative overflow-hidden rounded-2xl border text-left transition-all cursor-pointer ${
                            values.imageUrl === preset.url
                              ? "border-gold ring-2 ring-gold"
                              : "border-line hover:border-gold-dark"
                          }`}
                        >
                          <div className="aspect-16/10 w-full overflow-hidden bg-paper-raised">
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="p-2 bg-white">
                            <p className="text-[11px] font-bold text-ink line-clamp-1">{preset.label}</p>
                            <p className="text-[9px] font-mono text-steel truncate">{preset.url}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-end border-t border-line pt-3">
                      <button
                        type="button"
                        onClick={() => setPresetModalOpen(false)}
                        className="rounded-xl border border-line px-5 py-2 text-xs font-bold text-steel hover:bg-paper cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* FULL-SIZE LIGHTBOX MODAL */}
              {lightboxOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm cursor-pointer"
                  onClick={() => setLightboxOpen(false)}
                >
                  <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl">
                    <img src={currentImg} alt="Full Size" className="max-h-[85vh] w-auto object-contain" />
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(false)}
                      className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

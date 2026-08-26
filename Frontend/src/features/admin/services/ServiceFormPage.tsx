import { useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  Flame,
  Gauge,
  Settings2,
  Anchor,
  Droplet,
  ShieldCheck,
  Lock,
  PackageSearch,
  Eye,
  X,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  type ServiceFormValues,
} from "@/features/services/api/servicesApi";
import { StringListField } from "@/components/forms/StringListField";
import { CmsPreviewModal } from "@/features/admin/components/CmsPreviewModal";

const ICON_OPTIONS: Array<{ key: string; label: string; icon: LucideIcon }> = [
  { key: "flame", label: "Flame (Wellhead/Thermal)", icon: Flame },
  { key: "gauge", label: "Gauge (Pressure/Instrumentation)", icon: Gauge },
  { key: "settings", label: "Gears (Mechanical/Automation)", icon: Settings2 },
  { key: "anchor", label: "Anchor (Marine/Subsea)", icon: Anchor },
  { key: "droplet", label: "Droplet (Hydraulics/Fluids)", icon: Droplet },
  { key: "shield", label: "Shield (Preservation/Integrity)", icon: ShieldCheck },
  { key: "lock", label: "Lock (Anti-Tamper/Security)", icon: Lock },
  { key: "package", label: "Package (Procurement/OCTG)", icon: PackageSearch },
];

const AVAILABLE_IMAGE_PRESETS = [
  { path: "/images/services/wellhead-hero.png", title: "Wellhead Stack & Xmas Tree Assembly" },
  { path: "/images/services/choke-agbami-1.png", title: "Subsea Choke Valve Overhaul" },
  { path: "/images/services/choke-agbami-stripdown.png", title: "Choke Valve Teardown & Trim" },
  { path: "/images/services/control-panel-whcp.png", title: "Wellhead Control Panel (WHCP)" },
  { path: "/images/services/control-panel-internal.png", title: "WHCP Pneumatic Internals" },
  { path: "/images/services/preservation-highres-1.jpg", title: "Guardian Preservation Solution" },
  { path: "/images/services/preservation-climate-room.png", title: "Elastomer Clean Room" },
  { path: "/images/services/procurement-octg.png", title: "OCTG & Heavy Tubulars" },
  { path: "/images/services/procurement-flowmeters.png", title: "Custody Transfer Flowmeters" },
  { path: "/images/services/sealant-application.png", title: "High-Pressure Sealant Injection" },
  { path: "/images/services/anti-tamper-valve.png", title: "Anti-Tamper Security Flanges" },
  { path: "/images/services/drilling-support.png", title: "Drilling & Workover Support" },
  { path: "/images/services/fishing-tools.png", title: "Downhole Fishing Equipment" },
  { path: "/images/facility-valve-work.png", title: "Valve Bay Hydrostatic Testing" },
  { path: "/images/facility-workshop-wide.png", title: "Port Harcourt 1,500m² Workshop" },
];

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

  const [presetModalOpen, setPresetModalOpen] = useState(false);
  const [imageLightboxOpen, setImageLightboxOpen] = useState(false);
  const [livePreviewOpen, setLivePreviewOpen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isEditing && !existing) {
    return (
      <div className="p-12 text-center text-sm text-steel">
        <p>Loading service details…</p>
      </div>
    );
  }

  const initialValues: ServiceFormValues = existing
    ? {
        title: existing.title,
        slug: existing.slug,
        summary: existing.summary,
        scope: existing.scope || [],
        icon: existing.icon || "flame",
        imageUrl: existing.imageUrl ?? "",
        displayOrder: existing.displayOrder ?? 0,
        isFeatured: existing.isFeatured ?? false,
        isPublished: existing.isPublished ?? false,
      }
    : {
        title: "",
        slug: "",
        summary: "",
        scope: [""],
        icon: "flame",
        imageUrl: "/images/services/wellhead-hero.png",
        displayOrder: (services?.length ?? 0) + 1,
        isFeatured: true,
        isPublished: true,
      };

  return (
    <div className="space-y-6">
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            to="/admin/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-steel hover:text-gold-dark transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Services List</span>
          </Link>
          <h1 className="text-2xl font-bold text-ink">
            {isEditing ? `Edit Service: ${existing?.title}` : "Create New Engineering Service"}
          </h1>
          <p className="text-xs text-steel">
            Configure technical specifications, image assets, workshop capabilities, and catalog metadata.
          </p>
        </div>

        {isEditing && existing && (
          <Link
            to={`/services/${existing.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-ink hover:border-gold-dark hover:text-gold-dark transition-colors shadow-xs"
          >
            <ExternalLink size={13} />
            <span>View Public Page</span>
          </Link>
        )}
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-800 border border-emerald-500/30">
          <CheckCircle2 size={16} className="text-emerald-600 flex-none" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 2. MAIN 2-COLUMN WORKBENCH */}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ServiceSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload = {
              ...values,
              scope: values.scope.filter((s) => s.trim().length > 0),
            };
            if (isEditing && id) {
              await updateService({ id, ...payload }).unwrap();
              setFeedback("Service updated successfully!");
            } else {
              await createService(payload).unwrap();
              setFeedback("Service created successfully!");
            }
            setTimeout(() => {
              navigate("/admin/services");
            }, 1000);
          } catch (err: any) {
            alert(err?.data?.message || "An error occurred while saving the service.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const selectedIconObj = ICON_OPTIONS.find((i) => i.key === values.icon) || ICON_OPTIONS[0];
          const IconPreview = selectedIconObj.icon;

          const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Read as data URL for instant live preview and path assignment
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
              const dataUrl = uploadEvent.target?.result as string;
              setFieldValue("imageUrl", dataUrl);
              setImageLoadError(false);
              setFeedback(`Loaded image: ${file.name} (${Math.round(file.size / 1024)} KB)`);
              setTimeout(() => setFeedback(null), 3000);
            };
            reader.readAsDataURL(file);
          };

          return (
            <Form className="grid gap-8 lg:grid-cols-12" noValidate>
              {/* LEFT COLUMN: CORE SPECIFICATIONS & FORM (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl border border-line bg-white p-6 shadow-xs space-y-5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-steel border-b border-line pb-3">
                    General Service Information
                  </h2>

                  {/* Title & Slug */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="title" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                        Service Title *
                      </label>
                      <Field
                        id="title"
                        name="title"
                        placeholder="e.g. Wellhead & Xmas Tree Maintenance"
                        className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-gold-dark focus:bg-white focus:outline-none"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("title", e.target.value);
                          if (!isEditing) {
                            setFieldValue("slug", slugify(e.target.value));
                          }
                        }}
                      />
                      <ErrorMessage name="title" component="p" className="mt-1 text-[11px] text-danger" />
                    </div>

                    <div>
                      <label htmlFor="slug" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                        URL Slug *
                      </label>
                      <Field
                        id="slug"
                        name="slug"
                        placeholder="wellhead-xmastree"
                        className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-mono font-medium text-ink focus:border-gold-dark focus:bg-white focus:outline-none"
                      />
                      <ErrorMessage name="slug" component="p" className="mt-1 text-[11px] text-danger" />
                    </div>
                  </div>

                  {/* Icon Selector with Visual Radio Chips */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-steel">
                      Service Category Icon
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ICON_OPTIONS.map((opt) => {
                        const ItemIcon = opt.icon;
                        const isSelected = values.icon === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setFieldValue("icon", opt.key)}
                            className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                              isSelected
                                ? "border-gold bg-gold/10 text-gold-dark font-bold shadow-2xs"
                                : "border-line bg-paper hover:bg-paper-raised text-ink-soft"
                            }`}
                          >
                            <ItemIcon size={16} className={isSelected ? "text-gold-dark" : "text-steel"} />
                            <span className="text-xs truncate">{opt.key}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="summary" className="block text-xs font-bold uppercase tracking-wide text-steel">
                        Executive Summary *
                      </label>
                      <span className="text-[10px] font-mono text-steel">
                        {values.summary.length}/500 chars
                      </span>
                    </div>
                    <Field
                      id="summary"
                      name="summary"
                      as="textarea"
                      rows={3}
                      placeholder="High-level engineering overview of this service capability…"
                      className="w-full rounded-xl border border-line bg-paper p-3 text-xs text-ink focus:border-gold-dark focus:bg-white focus:outline-none leading-relaxed"
                    />
                    <ErrorMessage name="summary" component="p" className="mt-1 text-[11px] text-danger" />
                  </div>

                  {/* Scope Items Manager */}
                  <div>
                    <div className="mb-2">
                      <span className="block text-xs font-bold uppercase tracking-wide text-steel">
                        Technical Scope Bullets
                      </span>
                      <p className="text-[11px] text-steel">
                        Add key capability highlights shown on the public service card and detail page.
                      </p>
                    </div>
                    <StringListField name="scope" values={values.scope} />
                  </div>

                  {/* Display Order & Flags */}
                  <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-line">
                    <div>
                      <label htmlFor="displayOrder" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-steel">
                        Display Order Priority
                      </label>
                      <Field
                        id="displayOrder"
                        name="displayOrder"
                        type="number"
                        className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-xs font-mono font-bold text-ink focus:border-gold-dark focus:outline-none"
                      />
                      <p className="mt-1 text-[10px] text-steel">Lower numbers appear first on the site.</p>
                    </div>

                    <div className="space-y-3 pt-4">
                      <label className="flex items-center gap-2.5 text-xs font-bold text-ink cursor-pointer">
                        <Field type="checkbox" name="isFeatured" className="h-4 w-4 rounded border-line text-gold focus:ring-gold" />
                        <span>Featured Hero Service</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-xs font-bold text-ink cursor-pointer">
                        <Field type="checkbox" name="isPublished" className="h-4 w-4 rounded border-line text-emerald-600 focus:ring-emerald-500" />
                        <span>Published to Public Website</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-gold py-3 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all cursor-pointer shadow-sm disabled:opacity-50 text-center"
                  >
                    {isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Publish New Service"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLivePreviewOpen(true)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gold-dark/40 bg-gold/10 px-5 py-3 text-xs font-bold text-gold-dark hover:bg-gold/20 cursor-pointer transition-colors"
                  >
                    <Eye size={14} />
                    <span>Live Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/services")}
                    className="rounded-xl border border-line bg-white px-5 py-3 text-xs font-bold text-steel hover:text-ink hover:bg-paper transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: DEDICATED MEDIA & IMAGE INSPECTOR BAY (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. VISUAL MEDIA INSPECTOR CARD */}
                <div className="rounded-2xl border border-line bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-steel">
                      <ImageIcon size={15} className="text-gold-dark" />
                      <span>Service Media &amp; Banner Asset</span>
                    </div>
                    {values.imageUrl && !imageLoadError && (
                      <button
                        type="button"
                        onClick={() => setImageLightboxOpen(true)}
                        className="flex items-center gap-1 text-[11px] font-bold text-gold-dark hover:underline cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Full Size</span>
                      </button>
                    )}
                  </div>

                  {/* Real-time Image Preview Canvas */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-void-raised/90">
                    {values.imageUrl && !imageLoadError ? (
                      <img
                        src={values.imageUrl}
                        alt="Service Banner Preview"
                        className="h-full w-full object-cover"
                        onError={() => setImageLoadError(true)}
                        onLoad={() => setImageLoadError(false)}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-void-soft space-y-2">
                        <ImageIcon size={32} className="text-void-line" />
                        <p className="text-xs font-bold text-white">No Valid Image Assigned</p>
                        <p className="text-[11px] text-void-soft max-w-[24ch]">
                          Select an asset from the preset library or upload a file below.
                        </p>
                      </div>
                    )}

                    {/* Overlay Badges */}
                    {values.imageUrl && !imageLoadError && (
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="rounded-md bg-void/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-mono font-bold text-gold">
                          Active Preview
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue("imageUrl", "");
                            setImageLoadError(false);
                          }}
                          className="rounded-md bg-danger/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white hover:bg-danger cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Image URL Input Field */}
                  <div>
                    <label htmlFor="imageUrl" className="mb-1 block text-xs font-bold uppercase tracking-wide text-steel">
                      Image Path / URL
                    </label>
                    <Field
                      id="imageUrl"
                      name="imageUrl"
                      placeholder="/images/services/wellhead-hero.png"
                      className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-xs font-mono text-ink focus:border-gold-dark focus:bg-white focus:outline-none"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("imageUrl", e.target.value);
                        setImageLoadError(false);
                      }}
                    />
                  </div>

                  {/* Quick Action Buttons: Preset Picker & Local Upload */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPresetModalOpen(true)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2.5 text-xs font-bold text-gold-dark hover:bg-gold/20 transition-colors cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>Choose Preset</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2.5 text-xs font-bold text-ink hover:border-gold-dark hover:text-gold-dark transition-colors cursor-pointer shadow-2xs"
                    >
                      <Upload size={13} />
                      <span>Upload Local</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLocalFileUpload}
                    />
                  </div>
                </div>

                {/* 2. LIVE PUBLIC CARD SIMULATOR */}
                <div className="rounded-2xl border border-line bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-steel">
                      Live Public Website Simulation
                    </span>
                    <span className="rounded-full bg-paper border border-line px-2 py-0.5 text-[10px] font-mono text-steel">
                      Card Preview
                    </span>
                  </div>

                  {/* Mini Public Card Simulation */}
                  <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                    <div className="relative aspect-video w-full bg-void-raised overflow-hidden">
                      {values.imageUrl && !imageLoadError ? (
                        <img src={values.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-paper text-steel">
                          <ImageIcon size={24} />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 rounded-full bg-void/80 px-2 py-0.5 text-[9px] font-bold text-gold uppercase tracking-wider">
                        {values.isFeatured ? "Featured Solution" : "Standard Offering"}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gold/15 text-gold-dark">
                          <IconPreview size={13} />
                        </div>
                        <h4 className="font-bold text-ink text-xs line-clamp-1">
                          {values.title || "Service Title Placeholder"}
                        </h4>
                      </div>
                      <p className="text-[11px] text-ink-soft line-clamp-2 leading-relaxed">
                        {values.summary || "Summary text will describe the service scope on public cards…"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRESET ASSET PICKER MODAL */}
              {presetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4 backdrop-blur-xs">
                  <div className="relative w-full max-w-2xl rounded-3xl border border-line bg-white p-6 md:p-8 shadow-2xl max-h-[85vh] flex flex-col">
                    <button
                      type="button"
                      onClick={() => setPresetModalOpen(false)}
                      className="absolute right-5 top-5 text-steel hover:text-ink cursor-pointer"
                    >
                      <X size={20} />
                    </button>

                    <div className="border-b border-line pb-4 mb-4">
                      <h3 className="text-lg font-bold text-ink">DF&amp;E High-Resolution Asset Library</h3>
                      <p className="text-xs text-steel">
                        Select an authentic project or workshop photograph for this engineering capability.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1">
                      {AVAILABLE_IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => {
                            setFieldValue("imageUrl", preset.path);
                            setImageLoadError(false);
                            setPresetModalOpen(false);
                          }}
                          className={`group relative overflow-hidden rounded-xl border text-left transition-all cursor-pointer ${
                            values.imageUrl === preset.path
                              ? "border-gold ring-2 ring-gold"
                              : "border-line hover:border-gold-dark"
                          }`}
                        >
                          <div className="aspect-video w-full overflow-hidden bg-void">
                            <img
                              src={preset.path}
                              alt={preset.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-2 bg-white">
                            <p className="text-[11px] font-bold text-ink truncate">{preset.title}</p>
                            <p className="text-[9px] font-mono text-steel truncate">{preset.path}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FULL-SIZE IMAGE PREVIEW MODAL */}
              {imageLightboxOpen && values.imageUrl && (
                <div
                  onClick={() => setImageLightboxOpen(false)}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-6 backdrop-blur-sm cursor-zoom-out"
                >
                  <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/20 bg-void">
                    <img src={values.imageUrl} alt="" className="max-h-[80vh] w-auto object-contain" />
                    <div className="absolute bottom-0 inset-x-0 bg-void/90 p-3 text-center text-xs font-mono text-white">
                      {values.imageUrl}
                    </div>
                  </div>
                </div>
              )}

              {/* CMS LIVE SERVICE PREVIEW MODAL */}
              <CmsPreviewModal
                isOpen={livePreviewOpen}
                onClose={() => setLivePreviewOpen(false)}
                title={`Preview Service: ${values.title || "Untitled"}`}
                subtitle="Live responsive public presentation preview"
              >
                <div className="space-y-8">
                  {/* Hero Banner Area */}
                  <div className="relative overflow-hidden rounded-3xl bg-void p-8 text-white">
                    <div className="relative z-10 max-w-2xl space-y-3">
                      <span className="inline-block rounded-full bg-gold/20 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-gold">
                        Engineering Capability
                      </span>
                      <h1 className="text-2xl md:text-3xl font-bold">{values.title || "Service Title"}</h1>
                      <p className="text-sm text-void-soft leading-relaxed">
                        {values.summary || "High-level summary of service engineering capabilities."}
                      </p>
                    </div>
                  </div>

                  {/* Banner Image */}
                  {values.imageUrl && !imageLoadError && (
                    <div className="overflow-hidden rounded-2xl border border-line aspect-video max-h-80 w-full">
                      <img src={values.imageUrl} alt={values.title} className="h-full w-full object-cover" />
                    </div>
                  )}

                  {/* Overview */}
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-ink border-b border-line pb-2">Technical Overview</h3>
                    <p className="text-xs md:text-sm text-ink-soft leading-relaxed whitespace-pre-line">
                      {values.summary || "Detailed scope of work and engineering overview."}
                    </p>
                  </div>

                  {/* Scope of Work */}
                  {values.scope && values.scope.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-ink border-b border-line pb-2">Key Engineering Scope</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {values.scope.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 rounded-xl border border-line bg-paper p-3 text-xs text-ink font-medium">
                            <CheckCircle2 size={15} className="text-gold-dark shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CmsPreviewModal>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}


import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Eye,
  X,
  Star,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  type ProjectFormValues,
} from "@/features/projects/api/projectsApi";

const CATEGORY_OPTIONS = [
  { value: "wellhead", label: "Wellhead & Xmas Tree Maintenance" },
  { value: "control-panel", label: "Wellhead Control Panel (WHCP)" },
  { value: "choke-valve", label: "Subsea / Surface Choke Valve Overhaul" },
];

const PROJECT_PRESET_IMAGES = [
  { url: "/images/project-wellhead.jpg", label: "Total E&P Wellhead Offshore Campaign" },
  { url: "/images/project-control-panel.jpg", label: "Chevron Nigeria WHCP Refurbishment" },
  { url: "/images/project-choke-valve.jpg", label: "Star Deep Agbami Subsea Choke Valves" },
  { url: "/images/facility-yard-assembly.png", label: "Heavy Assembly Yard & Mobilization" },
  { url: "/images/facility-valve-work.png", label: "Valve Testing & Disassembly Workshop" },
  { url: "/images/facility-climate-room.png", label: "Clean Room Seal Rebuilding & Calibration" },
  { url: "/images/services/choke-agbami-1.png", label: "Agbami Deepwater Choke Teardown" },
  { url: "/images/services/whcp-pneumatics.png", label: "Pneumatic Control System Logic" },
  { url: "/images/services/wellhead-hero.png", label: "15,000 psi High Pressure Test Bay" },
  { url: "/images/services/hydro-flange-test.png", label: "Hydrostatic Flange Bolt-Torquing" },
];

const ProjectSchema = Yup.object({
  client: Yup.string().trim().required("Client name is required.").max(200),
  scope: Yup.string().trim().required("Scope of work description is required.").max(500),
  location: Yup.string().trim().required("Field / Facility location is required.").max(200),
  year: Yup.string().trim().required("Execution timeline is required.").max(50),
  category: Yup.string().required("Category selection is required."),
  displayOrder: Yup.number().min(0).required(),
});

export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: projects, isLoading } = useGetAllProjectsQuery();
  const existing = isEditing ? projects?.find((p) => p.id === id) : undefined;

  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const [presetModalOpen, setPresetModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isEditing && isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-steel">
        Loading project details…
      </div>
    );
  }

  const initialValues: ProjectFormValues = existing
    ? {
        client: existing.client,
        scope: existing.scope,
        location: existing.location,
        year: existing.year,
        category: existing.category,
        imageUrl: existing.imageUrl ?? "/images/project-wellhead.jpg",
        displayOrder: existing.displayOrder,
        isFeatured: existing.isFeatured,
        isPublished: existing.isPublished,
      }
    : {
        client: "",
        scope: "",
        location: "Offshore Niger Delta / Port Harcourt Yard",
        year: `${new Date().getFullYear()} – Ongoing`,
        category: "wellhead",
        imageUrl: "/images/project-wellhead.jpg",
        displayOrder: (projects?.length ?? 0) + 1,
        isFeatured: false,
        isPublished: true,
      };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-steel hover:text-ink transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Projects</span>
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-ink">
            {isEditing ? `Edit Project: ${existing?.client ?? "Record"}` : "Add New Project Case Study"}
          </h1>
          <p className="text-xs text-steel">
            Record major client scopes, offshore field locations, execution years, and visual photographic evidence.
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
        validationSchema={ProjectSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitError(null);
            if (isEditing && id) {
              await updateProject({ id, ...values }).unwrap();
            } else {
              await createProject(values).unwrap();
            }
            setSubmitting(false);
            navigate("/admin/projects");
          } catch (err: any) {
            setSubmitting(false);
            setSubmitError(err?.data?.message || err?.message || "Failed to save project. Please try again.");
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const currentImg = values.imageUrl || "/images/project-wellhead.jpg";

          return (
            <Form className="grid grid-cols-1 gap-8 lg:grid-cols-12" noValidate>
              {/* Left Column: Fields */}
              <div className="space-y-6 lg:col-span-7">
                <div className="space-y-5 rounded-3xl border border-line bg-white p-6 shadow-2xs">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3">
                    Project Scope &amp; Client Overview
                  </h2>

                  {/* Client & Category */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="client" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-steel">
                        Client / Operator <span className="text-danger">*</span>
                      </label>
                      <Field
                        id="client"
                        name="client"
                        placeholder="e.g. TotalEnergies E&P Nigeria"
                        className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-xs font-semibold text-ink outline-none focus:border-gold-dark focus:bg-white"
                      />
                      <ErrorMessage name="client" component="p" className="mt-1 text-[11px] text-danger" />
                    </div>

                    <div>
                      <label htmlFor="category" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-steel">
                        Engineering Category <span className="text-danger">*</span>
                      </label>
                      <Field
                        id="category"
                        name="category"
                        as="select"
                        className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-xs font-bold text-ink outline-none focus:border-gold-dark focus:bg-white"
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component="p" className="mt-1 text-[11px] text-danger" />
                    </div>
                  </div>

                  {/* Scope of Work */}
                  <div>
                    <label htmlFor="scope" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-steel">
                      Scope of Work Executed <span className="text-danger">*</span>
                    </label>
                    <Field
                      id="scope"
                      name="scope"
                      as="textarea"
                      rows={3}
                      placeholder="e.g. Comprehensive routine preventive maintenance, greasing, and valve cavity pressure testing across 24 offshore wellheads."
                      className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-xs font-medium text-ink leading-relaxed outline-none focus:border-gold-dark focus:bg-white"
                    />
                    <ErrorMessage name="scope" component="p" className="mt-1 text-[11px] text-danger" />
                  </div>

                  {/* Location & Year */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="location" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-steel">
                        Field / Yard Location <span className="text-danger">*</span>
                      </label>
                      <Field
                        id="location"
                        name="location"
                        placeholder="e.g. Ofon Field (OML 102), Offshore"
                        className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-xs font-semibold text-ink outline-none focus:border-gold-dark focus:bg-white"
                      />
                      <ErrorMessage name="location" component="p" className="mt-1 text-[11px] text-danger" />
                    </div>

                    <div>
                      <label htmlFor="year" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-steel">
                        Timeline / Year <span className="text-danger">*</span>
                      </label>
                      <Field
                        id="year"
                        name="year"
                        placeholder="e.g. 2021 – 2024 (Call-off)"
                        className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-xs font-semibold text-ink outline-none focus:border-gold-dark focus:bg-white"
                      />
                      <ErrorMessage name="year" component="p" className="mt-1 text-[11px] text-danger" />
                    </div>
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
                    <p className="mt-1 text-[11px] text-steel">Lower numbers appear first on the track record list.</p>
                  </div>
                </div>

                {/* Featured & Publishing Toggles */}
                <div className="space-y-4 rounded-3xl border border-line bg-white p-6 shadow-2xs">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3">
                    Display &amp; Feature Settings
                  </h2>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <Field
                      type="checkbox"
                      name="isFeatured"
                      className="h-5 w-5 rounded-lg border-line text-gold focus:ring-gold"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                        <Star size={13} className="fill-gold text-gold" />
                        <span>Feature on Homepage</span>
                      </div>
                      <div className="text-[11px] text-steel">
                        Highlighted in the homepage's flagship "Proven Track Record" section.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none border-t border-line pt-3">
                    <Field
                      type="checkbox"
                      name="isPublished"
                      className="h-5 w-5 rounded-lg border-line text-gold focus:ring-gold"
                    />
                    <div>
                      <div className="text-xs font-bold text-ink">Publish on Public Website</div>
                      <div className="text-[11px] text-steel">
                        Make this project case study publicly visible on `/projects`.
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
                    {isSubmitting ? "Saving Project…" : isEditing ? "Save Changes" : "Create Project"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/projects")}
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
                      <h2 className="text-sm font-bold uppercase tracking-wider text-ink">Project Photography</h2>
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
                      alt="Project Preview"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/project-wellhead.jpg";
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
                      placeholder="/images/project-wellhead.jpg"
                      className="w-full rounded-xl border border-line bg-paper-raised px-3.5 py-2 font-mono text-xs text-ink outline-none focus:border-gold-dark focus:bg-white"
                    />
                  </div>
                </div>

                {/* Live Public Card Simulator */}
                <div className="space-y-3 rounded-3xl border border-line bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-line pb-3">
                    <Layers size={15} className="text-gold-dark" />
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
                          (e.target as HTMLImageElement).src = "/images/project-wellhead.jpg";
                        }}
                      />
                      {values.isFeatured && (
                        <div className="absolute top-2 right-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-gold-ink shadow-xs flex items-center gap-1">
                          <Star size={10} className="fill-gold-ink" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-ink text-sm">
                          {values.client || "Client Name"}
                        </h4>
                        <span className="rounded bg-paper px-2 py-0.5 text-[10px] font-bold text-steel">
                          {CATEGORY_OPTIONS.find((c) => c.value === values.category)?.label || values.category}
                        </span>
                      </div>
                      <p className="text-xs text-steel line-clamp-2">
                        {values.scope || "Scope of work execution details."}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-line text-[11px] text-steel">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          <span>{values.location || "Field Location"}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar size={11} />
                          <span>{values.year || "Year"}</span>
                        </span>
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
                        <h3 className="text-base font-bold text-ink">Choose Project Asset Preset</h3>
                        <p className="text-xs text-steel">Select an authentic field or workshop photograph</p>
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
                      {PROJECT_PRESET_IMAGES.map((preset) => (
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

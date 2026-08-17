// Drives a proper form for each Json-typed content block instead of a raw
// JSON textarea. "array" keys render a repeatable list of objects (like
// ServiceFormPage's Scope FieldArray, one level deeper); "object" keys
// render a single fixed-shape form. Purely a frontend rendering concern —
// the backend stores/returns these as opaque validated JSON strings.
export type JsonFieldDef = { name: string; label: string; type: "text" | "number" | "checkbox" };

export type JsonFieldManifest = { kind: "array" | "object"; fields: JsonFieldDef[] };

export const JSON_FIELD_MANIFESTS: Record<string, JsonFieldManifest> = {
  "company.heroStats": {
    kind: "array",
    fields: [
      { name: "value", label: "Value", type: "number" },
      { name: "suffix", label: "Suffix", type: "text" },
      { name: "label", label: "Label", type: "text" },
    ],
  },
  "company.stats": {
    kind: "array",
    fields: [
      { name: "value", label: "Value", type: "number" },
      { name: "suffix", label: "Suffix", type: "text" },
      { name: "label", label: "Label", type: "text" },
      { name: "isYear", label: "Is Year", type: "checkbox" },
      { name: "prefix", label: "Prefix", type: "text" },
    ],
  },
  "home.whyDfande.features": {
    kind: "array",
    fields: [
      { name: "icon", label: "Icon (lucide name)", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "body", label: "Body", type: "text" },
    ],
  },
  "careers.values": {
    kind: "array",
    fields: [
      { name: "icon", label: "Icon (lucide name)", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "body", label: "Body", type: "text" },
    ],
  },
  "about.milestones": {
    kind: "array",
    fields: [
      { name: "year", label: "Year", type: "text" },
      { name: "title", label: "Milestone Title", type: "text" },
      { name: "description", label: "Detailed Scope / Description", type: "text" },
      { name: "badge", label: "Badge / Category Tag", type: "text" },
    ],
  },
  "certifications.items": {
    kind: "array",
    fields: [
      { name: "code", label: "Standard Code (e.g. ISO 9001:2015)", type: "text" },
      { name: "label", label: "Certification Label / Scope", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "documentSlug", label: "Secure Document Slug", type: "text" },
    ],
  },
  "services.preservation.caseStudies": {
    kind: "array",
    fields: [
      { name: "client", label: "Client Reference", type: "text" },
      { name: "title", label: "Project / Asset Title", type: "text" },
      { name: "beforeImage", label: "Before Photo Path", type: "text" },
      { name: "afterImage", label: "After Photo Path", type: "text" },
      { name: "scope", label: "Scope & Preservation Treatment", type: "text" },
    ],
  },
  "faq.items": {
    kind: "array",
    fields: [
      { name: "question", label: "Question", type: "text" },
      { name: "answer", label: "Answer", type: "text" },
      { name: "category", label: "Category (e.g. Capabilities, Facilities, Compliance)", type: "text" },
    ],
  },
  "partners.keyCustomers": {
    kind: "array",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "logo", label: "Logo path", type: "text" },
    ],
  },
  "partners.majorPartners": {
    kind: "array",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "logo", label: "Logo path", type: "text" },
    ],
  },
  "home.about.headline": {
    kind: "object",
    fields: [
      { name: "plain", label: "Plain lead-in", type: "text" },
      { name: "highlight", label: "Highlighted clause", type: "text" },
    ],
  },
  "home.whyDfande.headline": {
    kind: "object",
    fields: [
      { name: "plain", label: "Plain lead-in", type: "text" },
      { name: "highlight", label: "Highlighted clause", type: "text" },
    ],
  },
};

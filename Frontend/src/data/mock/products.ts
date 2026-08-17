// Sourced from the client brief (Divine Flame Website Revamp.docx) — real
// DFANDE product families, no backend entity yet (Phase 1, matches how
// Services looked before it got a real API — a likely next candidate to
// migrate to the CMS).
export type ProductFamily = {
  slug: string;
  title: string;
  items: string[];
  application?: string;
};

export const products: ProductFamily[] = [
  {
    slug: "wellhead-equipment",
    title: "Wellhead Equipment & Accessories",
    items: [
      "Surface Wellheads — unitized, splitter, conventional & compact designs",
      "Subsea Wellheads",
      "Xmas Trees — block & standard designs, single or dual strings",
      "Running Tools",
      "Hangers, Suspension Caps, Adapters, Dry Hole Trees",
      "Full range of spare parts & accessories",
    ],
    application: "Producer wells, injectors, exploratory wells",
  },
  {
    slug: "mudline-suspension",
    title: "Mudline Suspension Systems",
    items: ["Tersus Mudline Suspension", "SD-1 Mudline Suspension", "SD-1 Mudline Casing Support", "PCT Tieback"],
  },
  {
    slug: "chokes-gate-valves",
    title: "Chokes & Gate Valves",
    items: ["Subsea Choke Valves / Inserts", "Surface Choke Valves", "Gate Valves", "Actuators", "Positioners", "Spares"],
    application: "Oil, gas & water injection wells",
  },
  {
    slug: "wellhead-control-panels",
    title: "Wellhead Control Panels",
    items: [
      "Single-Well Wellhead Control Panel",
      "Multi-Well Wellhead Control Panel",
      "Installation materials",
      "Consumables",
      "Spares",
    ],
  },
  {
    slug: "mro-spares",
    title: "Maintenance, Repairs & Operations (MRO) Spares",
    items: ["OEM spare parts for oilfield equipment", "Critical spares for oilfield equipment", "Tools"],
  },
];

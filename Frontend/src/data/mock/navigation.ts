export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Company Overview", href: "/about", description: "Who we are, local content & operational values" },
      { label: "Key Milestones & NCEC", href: "/about#milestones", description: "Agbami, Local Assemblage & NCDMB Accreditations" },
      { label: "Port Harcourt Facility", href: "/about#facility", description: "1,500m² Workshop, 30,000psi Testing & Warehouse" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Wellhead & Xmas Tree Services", href: "/services/wellhead-xmas-tree" },
      { label: "Surface & Subsea Choke Valves", href: "/services/choke-valve" },
      { label: "Wellhead Control Panels", href: "/services/wellhead-control-panel" },
      { label: "Fishing & Re-entry Services", href: "/services/fishing-re-entry" },
      { label: "Sealant Injection Services", href: "/services/sealant-injection" },
      { label: "Equipment Preservation", href: "/services/equipment-preservation" },
      { label: "Anti-Tamper Nut Services", href: "/services/anti-tamper-nut" },
      { label: "Supply & Procurement Services", href: "/services/supply-procurement" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "All Products Overview", href: "/products" },
      { label: "Wellhead Equipment & Accessories", href: "/products#wellhead-equipment" },
      { label: "Mudline Suspension Systems", href: "/products#mudline-suspension" },
      { label: "Chokes & Gate Valves", href: "/products#chokes-gate-valves" },
      { label: "Wellhead Control Panels", href: "/products#wellhead-control-panels" },
      { label: "MRO Spares & Tools", href: "/products#mro-spares" },
    ],
  },
  {
    label: "Work Experience",
    href: "/work-experience",
    children: [
      { label: "All Contract Records", href: "/work-experience" },
      { label: "Wellhead & Xmas Tree Experience", href: "/work-experience?category=wellhead" },
      { label: "Choke Valve Supply & Refurb", href: "/work-experience?category=choke-valve" },
      { label: "Wellhead Control Panels", href: "/work-experience?category=control-panel" },
    ],
  },
  {
    label: "Certifications",
    href: "/certifications",
    children: [
      { label: "ISO 9001 · 14001 · 45001", href: "/certifications#iso" },
      { label: "HSE Policy Statement", href: "/certifications#hse-policy" },
      { label: "Corporate Quality Policy", href: "/certifications#quality-policy" },
    ],
  },
  { label: "FAQs", href: "/faq" },
  { label: "Careers", href: "/careers" },
];

export const contactCta = { label: "Contact Us", href: "/contact" };

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Wellhead & Xmas Tree Services", href: "/services/wellhead-xmas-tree" },
      { label: "Surface & Subsea Choke Valve Services", href: "/services/choke-valve" },
      { label: "Wellhead Control Panel Services", href: "/services/wellhead-control-panel" },
      { label: "Fishing & Re-entry Services", href: "/services/fishing-re-entry" },
      { label: "Sealant Injection Services", href: "/services/sealant-injection" },
      { label: "Oilfield Equipment Preservation Services", href: "/services/equipment-preservation" },
      { label: "Anti-Tamper Nut Services", href: "/services/anti-tamper-nut" },
      { label: "Supply & Procurement Services", href: "/services/supply-procurement" },
    ],
  },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  {
    label: "Certifications & HSE",
    href: "/certifications",
    children: [
      { label: "ISO Certifications", href: "/certifications#iso" },
      { label: "HSE Policy", href: "/certifications#hse-policy" },
      { label: "Quality Policy", href: "/certifications#quality-policy" },
    ],
  },
  { label: "Careers", href: "/careers" },
];

export const contactCta = { label: "Contact Us", href: "/contact" };

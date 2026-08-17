export type Project = {
  client: string;
  scope: string;
  location: string;
  year: string;
  category: "wellhead" | "control-panel" | "choke-valve";
};

// Sourced from WORK EXPERIENCE.doc — current through 2025.
export const projects: Project[] = [
  {
    client: "Chevron Nigeria Ltd",
    scope: "Well Services Contract — Supply, Installation & Maintenance of Wellheads, Xmas Trees and associated MRO materials",
    location: "Chevron Nigeria JV Assets",
    year: "2015 – till date",
    category: "wellhead",
  },
  {
    client: "Seplat Energy",
    scope: "1st & 2nd Line Wellhead Maintenance Services",
    location: "Offshore, Nigeria",
    year: "2025 – till date",
    category: "wellhead",
  },
  {
    client: "Seplat Energy",
    scope: "Supply & Installation of Wellhead Services for Western and Eastern Assets",
    location: "Western and Eastern Assets, Nigeria",
    year: "2024 – till date",
    category: "wellhead",
  },
  {
    client: "First E&P",
    scope: "Supply, Installation & Maintenance of Wellheads, Xmas Trees and associated Spares",
    location: "First E&P JV Assets",
    year: "2004 – 2024",
    category: "wellhead",
  },
  {
    client: "SPDC (Shell)",
    scope: "Supply, Installation & Maintenance of Wellheads, Xmas Trees, Wellhead Control Panels and associated Spares",
    location: "SPDC Nigeria JV Assets",
    year: "2012 – till date",
    category: "wellhead",
  },
  {
    client: "ExxonMobil",
    scope: "Supply, Installation & Maintenance of Wellheads, Xmas Trees and associated Spares",
    location: "ExxonMobil Nigeria JV Assets",
    year: "2004 – 2024",
    category: "wellhead",
  },
  {
    client: "NNPC E&P Ltd (formerly NPDC)",
    scope: "Global Contracts for Provision of Wellhead Equipment and Services",
    location: "OML 98",
    year: "2021",
    category: "wellhead",
  },
  {
    client: "TotalEnergies (TOTAL)",
    scope: "Supply, Installation and Maintenance of Wellheads, Xmas Trees and Accessories",
    location: "TotalEnergies JV Offshore",
    year: "2010 – 2012",
    category: "wellhead",
  },
  {
    client: "Addax Petroleum",
    scope: "Supply, Installation & Maintenance of Surface Wellhead & Tree Equipment",
    location: "OML 123 & 124",
    year: "2006 – 2009",
    category: "wellhead",
  },
  {
    client: "Oriental Energy (formerly Afren)",
    scope: "Supply & Installation of Wellheads, Xmas Trees and associated equipment",
    location: "Offshore, Nigeria",
    year: "2012 – till date",
    category: "wellhead",
  },
  {
    client: "Daewoo Nigeria",
    scope: "Supply, Installation, Hook-up & Commissioning of Wellhead Control Panels",
    location: "Gbaran",
    year: "2022 – till date",
    category: "control-panel",
  },
  {
    client: "Seflam",
    scope: "Supply, Installation, Hook-up & Commissioning of Wellhead Control Panels",
    location: "UZU & EPU fields",
    year: "2024 – till date",
    category: "control-panel",
  },
  {
    client: "Chevron Nigeria Ltd",
    scope: "Supply, Installation, Inspection, Testing, Maintenance, Strip down, Retrofitting & Re-assembly of Subsea Choke Valves",
    location: "Chevron Nigeria JV Assets",
    year: "2015 – till date",
    category: "choke-valve",
  },
  {
    client: "Newcross Petroleum Ltd",
    scope: "Supply of Adjustable Choke Valves",
    location: "Efe Field",
    year: "2021",
    category: "choke-valve",
  },
  {
    client: "SNEPCo",
    scope: "Supply, Refurbishment & Recertification of Subsea Choke Valves",
    location: "Bonga Main Field",
    year: "2005",
    category: "choke-valve",
  },
];

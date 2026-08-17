export type ServiceGalleryItem = {
  url: string;
  caption: string;
  tag: string;
};

export const SERVICE_GALLERIES: Record<string, ServiceGalleryItem[]> = {
  "wellhead-xmas-tree": [
    {
      url: "/images/service-wellhead.png",
      caption: "Xmas Tree Assembly on Test Stand",
      tag: "Assembly",
    },
    {
      url: "/images/services/wellhead-yard.png",
      caption: "Port Harcourt Staging & Yard Assembly",
      tag: "Yard Staging",
    },
    {
      url: "/images/services/wellhead-stack.png",
      caption: "High-Pressure Stack-up & Spool Integration",
      tag: "Pressure Test",
    },
    {
      url: "/images/services/wellhead-xmastree.png",
      caption: "Dual-Block Surface Xmas Tree",
      tag: "Xmas Tree",
    },
  ],
  "choke-valve": [
    {
      url: "/images/service-valve.png",
      caption: "Master Flo Surface Choke Rebuild",
      tag: "Overhaul",
    },
    {
      url: "/images/services/choke-agbami-1.png",
      caption: "Agbami Deepwater Subsea Choke Inspection",
      tag: "Subsea Choke",
    },
    {
      url: "/images/services/choke-agbami-stripdown.png",
      caption: "Actuator Recalibration & FAT Testing",
      tag: "Actuation",
    },
    {
      url: "/images/services/choke-valve-overhaul.png",
      caption: "Tungsten Carbide Trim Replacement",
      tag: "Precision Trim",
    },
  ],
  "wellhead-control-panel": [
    {
      url: "/images/service-control-panel.jpg",
      caption: "Multi-Well High-Pressure WHCP Unit",
      tag: "WHCP System",
    },
    {
      url: "/images/services/control-panel-whcp.png",
      caption: "Hydraulic & Pneumatic Logic Manifold",
      tag: "Control Logic",
    },
    {
      url: "/images/services/control-panel-internal.png",
      caption: "Internal Tubing & Relief Circuitry",
      tag: "Commissioning",
    },
  ],
  "fishing-re-entry": [
    {
      url: "/images/service-fishing.jpg",
      caption: "Specialty Cased-Hole Overshot & Jar Tools",
      tag: "Fishing Tools",
    },
    {
      url: "/images/services/fishing-tools.png",
      caption: "Milling & Section Cutting Assemblies",
      tag: "Milling & Cutting",
    },
    {
      url: "/images/services/drilling-support.png",
      caption: "Drilling & Workover Support Package",
      tag: "Intervention",
    },
  ],
  "sealant-injection": [
    {
      url: "/images/service-sealant.jpg",
      caption: "High-Pressure Sealant Injection Skid",
      tag: "Injection Skid",
    },
    {
      url: "/images/services/sealant-application.png",
      caption: "Bubble-Tight Barrier Integrity Sealing",
      tag: "Barrier Integrity",
    },
    {
      url: "/images/services/sealant-testing.png",
      caption: "SCSSV Line Leak Test & Sealing",
      tag: "Pressure Testing",
    },
  ],
  "equipment-preservation": [
    {
      url: "/images/services/preservation-highres-1.jpg",
      caption: "Xmas Tree & Wellhead Protective Barrier Coating",
      tag: "Barrier Coating",
    },
    {
      url: "/images/services/preservation-climate-room.png",
      caption: "Climate-Controlled Elastomer Clean Room",
      tag: "Clean Room",
    },
    {
      url: "/images/services/preservation-highres-2.jpg",
      caption: "ExxonMobil Shorebase Asset Preservation",
      tag: "Field Preservation",
    },
    {
      url: "/images/services/preservation-highres-3.jpg",
      caption: "Riser & High-Pressure Equipment Custom Jackets",
      tag: "Custom Jackets",
    },
  ],
  "anti-tamper-nut": [
    {
      url: "/images/service-anti-tamper.jpg",
      caption: "Anti-Theft Flange Fastener System",
      tag: "Fastener Guard",
    },
    {
      url: "/images/services/anti-tamper-valve.png",
      caption: "Installed Valve Security Hardware",
      tag: "Asset Security",
    },
    {
      url: "/images/services/anti-tamper-flange.png",
      caption: "High-Torque Tamper-Proof Nuts",
      tag: "Flange Security",
    },
  ],
  "supply-procurement": [
    {
      url: "/images/service-procurement.jpg",
      caption: "Oilfield Equipment & Spares Staging",
      tag: "Materials Staging",
    },
    {
      url: "/images/services/procurement-octg.png",
      caption: "OCTG Casing & Tubing Supply",
      tag: "OCTG Supply",
    },
    {
      url: "/images/services/procurement-epc.png",
      caption: "Flowline Valves & Structural Materials",
      tag: "EPC Packages",
    },
    {
      url: "/images/services/procurement-flowmeters.png",
      caption: "Precision Flow Meters & Instrumentation",
      tag: "Instrumentation",
    },
  ],
};

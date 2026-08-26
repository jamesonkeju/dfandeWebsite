import React from "react";
import { Building2 } from "lucide-react";

interface ClientLogoProps {
  clientName: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
}

// Known brand logo mappings to crisp assets in public/images
const KNOWN_LOGOS: Record<string, { image: string; fallbackInitials: string; brandBg?: string }> = {
  chevron: { image: "/images/partner-chevron.png", fallbackInitials: "CVX" },
  shell: { image: "/images/partner-shell.png", fallbackInitials: "SPDC" },
  spdc: { image: "/images/partner-shell.png", fallbackInitials: "SPDC" },
  snepco: { image: "/images/partner-shell.png", fallbackInitials: "SNEPCO" },
  exxonmobil: { image: "/images/partner-exxonmobil.png", fallbackInitials: "XOM" },
  mobil: { image: "/images/partner-exxonmobil.png", fallbackInitials: "XOM" },
  total: { image: "/images/partner-total.png", fallbackInitials: "TTE" },
  totalenergies: { image: "/images/partner-total.png", fallbackInitials: "TTE" },
  nnpc: { image: "/images/partner-nnpc.png", fallbackInitials: "NNPC" },
  npdc: { image: "/images/partner-nnpc.png", fallbackInitials: "NNPC" },
  agip: { image: "/images/partner-agip.png", fallbackInitials: "ENI" },
  naoc: { image: "/images/partner-agip.png", fallbackInitials: "NAOC" },
  addax: { image: "/images/partner-addax.png", fallbackInitials: "ADX" },
  daewoo: { image: "/images/partner-daewoo.png", fallbackInitials: "DWO" },
  fmc: { image: "/images/partner-fmc-technologies.png", fallbackInitials: "FMC" },
  technipfmc: { image: "/images/partner-fmc-technologies.png", fallbackInitials: "TFMC" },
  ge: { image: "/images/partner-ge-oil-gas.png", fallbackInitials: "GE" },
  masterflo: { image: "/images/partner-masterflo.png", fallbackInitials: "MFL" },
  nov: { image: "/images/partner-nov.png", fallbackInitials: "NOV" },
  weatherford: { image: "/images/partner-weatherford.png", fallbackInitials: "WFT" },
  ameriforge: { image: "/images/partner-ameriforge.png", fallbackInitials: "AMF" },
  scv: { image: "/images/partner-scv.png", fallbackInitials: "SCV" },
};

function resolveClientBrand(name: string): { image?: string; initials: string; key: string } {
  const clean = (name || "").toLowerCase().trim();
  
  for (const [k, v] of Object.entries(KNOWN_LOGOS)) {
    if (clean.includes(k)) {
      return { image: v.image, initials: v.fallbackInitials, key: k };
    }
  }

  // Derive initials from words
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.length >= 2 
    ? (words[0][0] + words[1][0]).toUpperCase()
    : words[0]?.slice(0, 3).toUpperCase() || "ENG";

  return { initials, key: clean };
}

export function ClientLogo({
  clientName,
  className = "",
  size = "md",
  showName = false,
}: ClientLogoProps) {
  const [imgError, setImgError] = React.useState(false);
  const { image, initials } = resolveClientBrand(clientName);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
    xl: "h-20 w-28 text-lg",
  };

  const containerSizes = {
    sm: "h-9 px-2.5",
    md: "h-14 px-3.5",
    lg: "h-16 px-4",
    xl: "h-20 px-5",
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-sm transition-all duration-200 group-hover:border-gold/50 group-hover:shadow-md ${
          image && !imgError ? containerSizes[size] : sizeClasses[size]
        }`}
      >
        {image && !imgError ? (
          <img
            src={image}
            alt={`${clientName} logo`}
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          // Sleek Industrial Metallic Insignia Fallback
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-void-raised via-steel-dark to-void text-gold font-mono font-bold tracking-wider shadow-inner">
            <span>{initials}</span>
          </div>
        )}
      </div>

      {showName && (
        <div className="flex flex-col">
          <span className="font-bold text-ink text-sm leading-tight">{clientName}</span>
          <span className="text-[11px] text-steel font-medium flex items-center gap-1 mt-0.5">
            <Building2 size={11} className="text-gold-dark" /> Verified Operator Record
          </span>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Building2 } from "lucide-react";

interface ClientLogoProps {
  clientName: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
}

// Known brand logo mappings to crisp assets in public/images
const KNOWN_LOGOS: Record<
  string,
  {
    image?: string;
    fallbackInitials: string;
    brandBg?: string;
    customSvg?: (props: { className?: string }) => React.ReactNode;
  }
> = {
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
  seplat: {
    fallbackInitials: "SEPLAT",
    customSvg: () => (
      <div className="flex h-full w-full items-center justify-center gap-2 px-1">
        <svg viewBox="0 0 36 36" className="h-7 w-7 shrink-0" fill="none">
          <circle cx="18" cy="18" r="17" fill="#0D5C3A" />
          <path d="M12 24L18 10L24 24H19.5L18 20.5L16.5 24H12Z" fill="#F39200" />
          <circle cx="18" cy="16" r="2.5" fill="#FFFFFF" />
        </svg>
        <span className="font-sans font-black text-xs md:text-sm tracking-tight text-[#0D5C3A] uppercase">
          SEPLAT <span className="text-[#F39200]">ENERGY</span>
        </span>
      </div>
    ),
  },
  "first e&p": {
    fallbackInitials: "F-E&P",
    customSvg: () => (
      <div className="flex h-full w-full items-center justify-center gap-2 px-1">
        <svg viewBox="0 0 36 36" className="h-7 w-7 shrink-0" fill="none">
          <rect width="36" height="36" rx="8" fill="#990000" />
          <path d="M10 10H26V14H15V17H24V21H15V26H10V10Z" fill="#FFFFFF" />
        </svg>
        <span className="font-sans font-black text-xs md:text-sm tracking-tight text-[#990000] uppercase">
          FIRST <span className="text-[#0B2545]">E&P</span>
        </span>
      </div>
    ),
  },
  oriental: {
    fallbackInitials: "OEL",
    customSvg: () => (
      <div className="flex h-full w-full items-center justify-center gap-2 px-1">
        <svg viewBox="0 0 36 36" className="h-7 w-7 shrink-0" fill="none">
          <circle cx="18" cy="18" r="17" fill="#006666" />
          <polygon points="18,7 21,15 29,18 21,21 18,29 15,21 7,18 15,15" fill="#D4AF37" />
        </svg>
        <span className="font-sans font-black text-xs md:text-sm tracking-tight text-[#006666] uppercase">
          ORIENTAL <span className="text-[#D4AF37]">ENERGY</span>
        </span>
      </div>
    ),
  },
  newcross: {
    fallbackInitials: "NCX",
    customSvg: () => (
      <div className="flex h-full w-full items-center justify-center gap-2 px-1">
        <svg viewBox="0 0 36 36" className="h-7 w-7 shrink-0" fill="none">
          <circle cx="18" cy="18" r="17" fill="#004D40" />
          <path d="M10 18H26M18 10V26" stroke="#C8963E" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <span className="font-sans font-black text-xs md:text-sm tracking-tight text-[#004D40] uppercase">
          NEWCROSS
        </span>
      </div>
    ),
  },
  seflam: {
    fallbackInitials: "SFL",
    customSvg: () => (
      <div className="flex h-full w-full items-center justify-center gap-2 px-1">
        <svg viewBox="0 0 36 36" className="h-7 w-7 shrink-0" fill="none">
          <rect width="36" height="36" rx="6" fill="#1B365D" />
          <path d="M8 22C12 14 18 12 28 14C24 22 18 24 8 22Z" fill="#C8963E" />
        </svg>
        <span className="font-sans font-black text-xs md:text-sm tracking-tight text-[#1B365D] uppercase">
          SEFLAM <span className="text-[#C8963E]">SGL</span>
        </span>
      </div>
    ),
  },
};

function resolveClientBrand(name: string) {
  const clean = (name || "").toLowerCase().trim();

  for (const [k, v] of Object.entries(KNOWN_LOGOS)) {
    if (clean.includes(k)) {
      return { image: v.image, initials: v.fallbackInitials, key: k, customSvg: v.customSvg };
    }
  }

  // Derive initials from words
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0]?.slice(0, 3).toUpperCase() || "ENG";

  return { initials, key: clean, customSvg: undefined, image: undefined };
}

export function ClientLogo({
  clientName,
  className = "",
  size = "md",
  showName = false,
}: ClientLogoProps) {
  const [imgError, setImgError] = React.useState(false);
  const { image, initials, customSvg } = resolveClientBrand(clientName);

  // Enlarged, high-presence dimensions
  const sizeClasses = {
    sm: "h-10 min-w-[110px] px-3 text-xs",
    md: "h-16 min-w-[160px] px-4 text-sm",
    lg: "h-20 min-w-[200px] px-5 text-base",
    xl: "h-24 min-w-[240px] px-6 text-lg",
  };

  const squareFallbackSizes = {
    sm: "h-10 w-10 text-xs",
    md: "h-16 w-16 text-sm",
    lg: "h-20 w-20 text-base",
    xl: "h-24 w-24 text-lg",
  };

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-2 shadow-xs transition-all duration-300 group-hover:border-gold-dark group-hover:shadow-md ${
          image && !imgError
            ? sizeClasses[size]
            : customSvg
            ? sizeClasses[size]
            : squareFallbackSizes[size]
        }`}
      >
        {image && !imgError ? (
          <img
            src={image}
            alt={`${clientName} logo`}
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            style={{ imageRendering: "auto" }}
          />
        ) : customSvg ? (
          customSvg({})
        ) : (
          // Sleek Industrial Metallic Insignia Fallback
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-void-raised via-steel-dark to-void text-gold font-mono font-bold tracking-wider shadow-inner">
            <span>{initials}</span>
          </div>
        )}
      </div>

      {showName && (
        <div className="flex flex-col">
          <span className="font-bold text-ink text-sm md:text-base leading-tight">{clientName}</span>
          <span className="text-[11px] text-steel font-medium flex items-center gap-1 mt-0.5">
            <Building2 size={11} className="text-gold-dark" /> Verified Operator Record
          </span>
        </div>
      )}
    </div>
  );
}

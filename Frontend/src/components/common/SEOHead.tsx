import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = "Divine Flame and Energy International (DFANDE) | Wellhead & Energy Engineering";
const DEFAULT_DESCRIPTION = "Divine Flame and Energy International Limited (DFANDE) — Nigeria's premier engineering and MRO partner for Wellheads, Xmas Trees, Subsea Choke Valves, and Wellhead Control Panels (WHCP). Fully ISO 9001, 14001, 45001 certified.";
const DEFAULT_IMAGE = "/images/company-profile-hero.png";
const SITE_URL = "https://dfande.com";

export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [
    "Wellhead maintenance Nigeria",
    "Xmas Tree supply Port Harcourt",
    "Subsea Choke Valve refurbishing",
    "Wellhead Control Panels WHCP",
    "Oil and gas procurement Nigeria",
    "Valve preservation Agbami field",
    "DFANDE",
    "Divine Flame and Energy International"
  ],
  canonicalUrl,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  structuredData,
}: SEOHeadProps) {
  const fullTitle = title 
    ? `${title} | DFANDE — Divine Flame & Energy International`
    : DEFAULT_TITLE;

  useEffect(() => {
    // 1. Page Title
    document.title = fullTitle;

    // 2. Meta tags helper
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let tag = document.querySelector(`meta[${attr}='${name}']`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // Standard Meta
    setMeta("description", description);
    setMeta("keywords", keywords.join(", "));
    setMeta("author", "Divine Flame and Energy International Limited");
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // OpenGraph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:image", ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`, true);
    setMeta("og:site_name", "Divine Flame & Energy International (DFANDE)", true);
    if (canonicalUrl) {
      setMeta("og:url", canonicalUrl.startsWith("http") ? canonicalUrl : `${SITE_URL}${canonicalUrl}`, true);
    }

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`);

    // Canonical link
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl 
      ? (canonicalUrl.startsWith("http") ? canonicalUrl : `${SITE_URL}${canonicalUrl}`)
      : window.location.href;

    // Structured Data JSON-LD
    const scriptId = "seo-json-ld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (structuredData) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(structuredData);
    } else if (script) {
      script.remove();
    }
  }, [fullTitle, description, keywords, canonicalUrl, ogType, ogImage, structuredData]);

  return null;
}

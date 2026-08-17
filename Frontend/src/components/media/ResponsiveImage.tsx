import { cn } from "@/lib/utils";

const RATIOS = {
  hero: "21/9",
  landscape: "3/2",
  portrait: "3/4",
  thumbnail: "1/1",
  feature: "4/3",
} as const;

type ResponsiveImageProps = {
  src: string;
  alt: string;
  ratio: keyof typeof RATIOS;
  fit?: "cover" | "contain";
  objectPosition?: string;
  className?: string;
};

/** Every photo on the site goes through one of five fixed ratios — never a
 * bespoke per-instance crop. Shared by HeroImage/FeatureImage/ServiceImage/ProjectImage. */
export function ResponsiveImage({
  src,
  alt,
  ratio,
  fit = "cover",
  objectPosition = "center",
  className,
}: ResponsiveImageProps) {
  return (
    <div className={cn("overflow-hidden bg-line", className)} style={{ aspectRatio: RATIOS[ratio] }}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full"
        style={{ objectFit: fit, objectPosition }}
        loading="lazy"
      />
    </div>
  );
}

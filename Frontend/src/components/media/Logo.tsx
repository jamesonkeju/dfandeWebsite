import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Rendered height in px; width follows automatically to preserve the source aspect ratio. */
  height?: number;
};

/** Height-driven only — width is always `auto` so the logo can never be
 * stretched independently on each axis. */
export function Logo({ className, height = 40 }: LogoProps) {
  return (
    <img
      src="/images/logo.png"
      alt="Divine Flame and Energy International Limited"
      height={height}
      style={{ height, width: "auto" }}
      className={cn("object-contain", className)}
    />
  );
}

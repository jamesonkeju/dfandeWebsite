import { ArrowUpRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const pill = cva(
  "group inline-flex items-center gap-3 rounded-full pl-6 pr-1.5 py-1.5 text-sm font-bold transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-gold text-gold-ink hover:bg-void-raised hover:text-white",
        secondary:
          "bg-white text-void border border-void-line hover:bg-void hover:text-white hover:border-void",
        "outline-on-photo": "bg-white/10 text-white border border-white/40 backdrop-blur-sm hover:bg-white hover:text-void",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

const chip = cva("flex h-8 w-8 flex-none items-center justify-center rounded-full transition-colors", {
  variants: {
    variant: {
      primary: "bg-white text-void group-hover:bg-gold group-hover:text-gold-ink",
      secondary: "bg-gold text-gold-ink group-hover:bg-white group-hover:text-void",
      "outline-on-photo": "bg-white/90 text-void group-hover:bg-gold group-hover:text-gold-ink",
    },
  },
  defaultVariants: { variant: "primary" },
});

type Variant = VariantProps<typeof pill>["variant"];

function Content({ variant, children }: { variant: Variant; children: ReactNode }) {
  return (
    <>
      {children}
      <span className={chip({ variant })}>
        <ArrowUpRight size={16} strokeWidth={2.5} />
      </span>
    </>
  );
}

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: Variant;
  className?: string;
};
type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  className?: string;
};

/** Pill button with a circular arrow chip that swaps color on hover. Renders
 * an `<a>` when `href` is given, a `<button>` otherwise — no Slot indirection. */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant, className, children, ...rest } = props;

  if ("href" in rest && rest.href) {
    return (
      <a className={cn(pill({ variant }), className)} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        <Content variant={variant}>{children}</Content>
      </a>
    );
  }

  return (
    <button className={cn(pill({ variant }), className)} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      <Content variant={variant}>{children}</Content>
    </button>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return <div id={id} className={cn("mx-auto max-w-[1200px] px-6 md:px-12", className)}>{children}</div>;
}

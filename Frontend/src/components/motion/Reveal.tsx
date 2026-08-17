import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { fadeUp, fadeIn } from "@/lib/motion/variants";
import { VIEWPORT_ONCE } from "@/lib/motion/animations";

type RevealProps = {
  children: ReactNode;
  variant?: Variants;
  className?: string;
  delay?: number;
};

/** Base scroll-triggered entrance. Falls back to a plain, instant-enough
 *  opacity fade when the user has reduced motion enabled — content is never
 *  gated behind a delay or transform completing. */
export function Reveal({ children, variant = fadeUp, className, delay = 0 }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_ONCE}
      variants={reduced ? fadeIn : variant}
      transition={{ delay: reduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

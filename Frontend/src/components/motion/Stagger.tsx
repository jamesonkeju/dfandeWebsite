import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/motion/variants";

// VIEWPORT_ONCE's amount:0.3 requires 30% of the target's own height to be
// on-screen before triggering. That's fine for short sections, but a grid
// can hold far more rows than fit in one viewport (e.g. 15 items = 8 rows),
// so 30% of its total height is never reached and the reveal never fires —
// confirmed via screenshots where a short filtered grid (3-4 items) animated
// in fine but the full unfiltered grid stayed permanently blank. Grids use
// their own much lower threshold so the reveal fires as soon as the top of
// the grid is in view, regardless of how many rows follow below the fold.
const GRID_VIEWPORT = { once: true, amount: 0.05 } as const;

export function StaggerGroup({
  children,
  className,
  staggerDelay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={GRID_VIEWPORT}
      variants={reduced ? fadeIn : staggerContainer(staggerDelay)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} variants={reduced ? fadeIn : fadeUp}>
      {children}
    </motion.div>
  );
}

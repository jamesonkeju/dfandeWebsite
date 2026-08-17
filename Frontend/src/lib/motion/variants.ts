import type { Variants } from "motion/react";
import { transition } from "./transitions";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: transition.base },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition.base },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: transition.base },
};

/** Wraps a card grid; children should use `fadeUp` and inherit the stagger from this parent. */
export const staggerContainer = (staggerDelay = 0.08): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: staggerDelay, delayChildren: 0.05 },
  },
});

/** Opacity + scale settle, for section photography entering view. (An earlier
 * clip-path-based wipe never actually animated — clip-path doesn't reliably
 * run through Motion's fast animation path — so images stayed permanently
 * clipped to zero height. This is the fix, verified in a real browser.) */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

import { motion, useReducedMotion } from "motion/react";
import { VIEWPORT_ONCE } from "@/lib/motion/animations";
import { cn } from "@/lib/utils";

export type TextRevealWord = { text: string; highlight?: boolean };

const word = {
  hidden: { opacity: 0, y: "0.4em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * Word-by-word entrance for headlines — the effect Oilix gets from GSAP's
 * SplitText plugin, reproduced here as a manual span-split + Framer stagger
 * so no second animation engine is needed (see report Section K).
 */
export function TextReveal({ words, className }: { words: TextRevealWord[]; className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_ONCE}
      variants={{ show: { transition: { staggerChildren: reduced ? 0 : 0.045 } } }}
      aria-label={words.map((w) => w.text).join(" ")}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w.text}-${i}`}
          variants={reduced ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : word}
          className={cn("inline-block", w.highlight && "highlight")}
          style={{ marginRight: "0.28em" }}
          aria-hidden="true"
        >
          {w.text}
        </motion.span>
      ))}
    </motion.span>
  );
}

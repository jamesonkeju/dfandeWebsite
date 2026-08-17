import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useTransform, animate } from "motion/react";

type CounterUpProps = {
  /** Numeric target the counter animates to. */
  value: number;
  /** Rendered before/after the number, e.g. "0–" and "psi". */
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Years (e.g. 2003) shouldn't get a thousands separator. */
  isYear?: boolean;
};

/** Count-up on scroll into view, once. Renders the final value immediately
 *  under reduced motion instead of animating. */
export function CounterUp({ value, prefix = "", suffix = "", className, isYear = false }: CounterUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) =>
    isYear ? String(Math.round(v)) : Math.round(v).toLocaleString(),
  );

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, reduced, value, motionValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

// Single timing/easing system — everything in the app animates through these
// tokens so motion feels like one language, not per-section bespoke tuning.

export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.85,
} as const;

export const transition = {
  fast: { duration: DURATION.fast, ease: EASE_PREMIUM },
  base: { duration: DURATION.base, ease: EASE_PREMIUM },
  slow: { duration: DURATION.slow, ease: EASE_PREMIUM },
};

import { Container } from "@/components/layout/Container";

/** Placeholder for every route beyond the homepage — Phase 0 builds the
 * homepage only (report Section N). */
export function ComingSoonPage() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-gold-dark">Phase 1</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">This page is coming next</h1>
      <p className="mt-3 max-w-[46ch] text-ink-soft">
        Phase 0 ships the homepage first. This section builds out once the homepage is signed off.
      </p>
      <a href="/" className="mt-6 text-xs font-bold uppercase tracking-wide text-gold-dark">
        ← Back home
      </a>
    </Container>
  );
}

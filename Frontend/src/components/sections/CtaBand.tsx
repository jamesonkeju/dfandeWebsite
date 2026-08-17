import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

export function CtaBand() {
  return (
    <section className="bg-void">
      <Container className="flex flex-col items-center gap-6 py-16 text-center">
        <Reveal>
          <h2 className="max-w-[24ch] text-2xl font-bold text-white md:text-3xl">
            Engineering challenge? Talk to DF&amp;E about your next wellhead project.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Button href="/contact" variant="primary">
            Contact Us
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

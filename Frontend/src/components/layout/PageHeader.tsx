import type { ReactNode } from "react";
import { Container } from "./Container";
import { Reveal } from "@/components/motion/Reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <section className="border-b border-void-line bg-void py-16 md:py-20">
      <Container>
        <Reveal>
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h1 className="mt-3 max-w-[30ch] text-3xl font-bold text-white md:text-5xl">{title}</h1>
          {description && <p className="mt-4 max-w-[65ch] text-void-soft">{description}</p>}
        </Reveal>
      </Container>
    </section>
  );
}

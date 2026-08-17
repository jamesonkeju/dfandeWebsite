import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { majorPartners, keyCustomers } from "@/data/mock/partners";

export function Partners() {
  const marqueeLogos = [...keyCustomers, ...keyCustomers];

  return (
    <section className="border-y border-line bg-paper-raised py-14">
      <Reveal>
        <p className="eyebrow text-center text-gold-dark">Trusted By Nigeria&rsquo;s Leading Operators</p>
      </Reveal>

      <div className="group mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max gap-16 motion-safe:animate-[marquee_28s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]">
          {marqueeLogos.map((c, i) => (
            <img
              key={`${c.name}-${i}`}
              src={c.logo}
              alt={c.name}
              className="h-9 w-auto flex-none object-contain grayscale transition-all hover:grayscale-0"
            />
          ))}
        </div>
      </div>

      <Container>
        <p className="mt-8 text-center text-xs font-bold uppercase tracking-wide text-steel">OEM Partners</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {majorPartners.map((partner) => (
            <img
              key={partner.name}
              src={partner.logo}
              alt={partner.name}
              className="h-7 w-auto flex-none object-contain grayscale transition-all hover:grayscale-0"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

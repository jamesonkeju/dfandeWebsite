import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { CounterUp } from "@/components/motion/CounterUp";
import { transition } from "@/lib/motion/transitions";
import { company } from "@/data/mock/company";

// Real captions and photography sourced from dfande.com's own hero slider —
// same content, re-sourced from higher-resolution originals in Img/2019.
// "Local Might, Global Reach." stays fixed as the brand's core tagline;
// only the eyebrow, caption line and photo rotate per slide.
const heroSlides = [
  {
    image: "/images/hero/hero-facility.jpg",
    alt: "Aerial view of DF&E's Port Harcourt workshop and warehouse facility",
    eyebrow: "In-Country Support Facility",
    caption: "Workshop · Warehouse · Service Parts Support — 100% Local Assemblage & Testing",
  },
  {
    image: "/images/hero/hero-excellence.jpg",
    alt: "DF&E technicians lifting a wellhead component with an overhead hoist",
    eyebrow: "Hallmark of Excellence",
    caption: "Building Potentials for Local Content — Improving In-Country Capacity",
  },
  {
    image: "/images/hero/hero-wellhead-business.jpg",
    alt: "DF&E technician servicing a wellhead choke valve actuator",
    eyebrow: "Majority Market Shareholder",
    caption: "For the Nigerian Wellhead, Xmas Tree & Valve Business",
  },
  {
    image: "/images/hero/hero-climate-room.jpg",
    alt: "Climate-controlled spares storage room at DF&E's warehouse",
    eyebrow: "Climate Controlled Room",
    caption: "Current Inventory Worth Over $10 Million",
  },
];

const SLIDE_INTERVAL_MS = 7000;

export function Hero() {
  const reduced = useReducedMotion();
  const [statA, statB] = company.heroStats;
  const [slideIndex, setSlideIndex] = useState(0);

  // Restarts from whichever slide is current whenever slideIndex changes —
  // including from a manual click — so a manual navigation and the next
  // autoplay tick never land within moments of each other and cause a
  // surprise double-advance (confirmed reproducible without this: three
  // quick manual clicks landed back on slide 1 because a stale autoplay
  // tick fired concurrently and advanced an extra step).
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setSlideIndex((i) => (i + 1) % heroSlides.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduced, slideIndex]);

  function goTo(delta: number) {
    setSlideIndex((i) => (i + delta + heroSlides.length) % heroSlides.length);
  }

  const slide = heroSlides[slideIndex];

  return (
    <section className="relative overflow-hidden bg-void">
      <AnimatePresence initial={false}>
        <motion.img
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.9, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "60% 40%" }}
        />
      </AnimatePresence>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(20,22,26,0.96) 15%, rgba(20,22,26,0.72) 45%, rgba(20,22,26,0.35) 75%)",
        }}
      />

      {/* Prev/next controls — visible whenever a pointer is nearby, matching
          the manual slider affordance on dfande.com's own hero. */}
      <button
        type="button"
        onClick={() => goTo(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 p-2 text-white transition-colors hover:border-gold hover:text-gold md:left-6"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => goTo(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 p-2 text-white transition-colors hover:border-gold hover:text-gold md:right-6"
      >
        <ChevronRight size={20} />
      </button>

      <Container className="relative pt-20 pb-40 md:pt-28 md:pb-56">
        <AnimatePresence mode="wait">
          <motion.p
            key={slide.eyebrow}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.4 }}
            className="eyebrow text-gold"
          >
            {slide.eyebrow}
          </motion.p>
        </AnimatePresence>

        <h1 className="mt-4 max-w-[16ch] text-4xl leading-[1.05] text-white md:text-6xl">
          <TextReveal className="block" words={[{ text: "Local" }, { text: "Might," }]} />
          <TextReveal
            className="block"
            words={[
              { text: "Global", highlight: true },
              { text: "Reach.", highlight: true },
            ]}
          />
        </h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={slide.caption}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.05 }}
            className="mt-4 max-w-[46ch] text-lg font-bold text-white md:text-xl"
          >
            {slide.caption}
          </motion.p>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition.base, delay: reduced ? 0 : 0.3 }}
          className="mt-4 max-w-[52ch] text-void-soft md:text-lg"
        >
          ISO-certified engineering, procurement and technical solutions for wellhead, Xmas tree and
          choke valve equipment across Nigeria&rsquo;s oil &amp; gas sector.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition.base, delay: reduced ? 0 : 0.45 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Button href="/services" variant="primary">
            Explore Our Services
          </Button>
          <Button href="/contact" variant="outline-on-photo">
            Contact Us
          </Button>
        </motion.div>

        <div className="mt-10 flex gap-2">
          {heroSlides.map((s, i) => (
            <button
              key={s.image}
              type="button"
              onClick={() => setSlideIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === slideIndex}
              className={`h-1.5 rounded-full transition-all ${i === slideIndex ? "w-8 bg-gold" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </Container>

      {/* Docked stat + photo + text cluster, overlapping the hero's bottom edge */}
      <Container className="relative -mt-28 pb-10 md:-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition.slow, delay: reduced ? 0 : 0.15 }}
          className="grid gap-4 md:grid-cols-[1.1fr_0.9fr_1.4fr]"
        >
          <div className="flex items-center gap-6 rounded-2xl bg-gold px-7 py-6 text-gold-ink">
            <div>
              <CounterUp value={statA.value} suffix={statA.suffix} className="block text-3xl font-bold" />
              <span className="text-xs font-bold uppercase tracking-wide">{statA.label}</span>
            </div>
            <div className="h-10 w-px bg-gold-ink/25" />
            <div>
              <CounterUp value={statB.value} suffix={statB.suffix} className="block text-3xl font-bold" />
              <span className="text-xs font-bold uppercase tracking-wide">{statB.label}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
            <img
              src="/images/service-valve.png"
              alt="DF&E technician servicing an actuator on the workshop bench"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="rounded-2xl bg-void-raised px-7 py-6">
            <h3 className="text-lg font-bold text-white">Engineering Discipline</h3>
            <p className="mt-2 text-sm text-void-soft">
              Procurement, installation, inspection, testing, repairs and maintenance — delivered to
              ISO 9001, ISO 14001 and ISO 45001 standards.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

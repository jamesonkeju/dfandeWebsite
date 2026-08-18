import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CounterUp } from "@/components/motion/CounterUp";
import { imageReveal } from "@/lib/motion/variants";
import { CtaBand } from "@/components/sections/CtaBand";
import { Partners } from "@/components/sections/Partners";
import { useContent } from "@/features/content/hooks/useContent";
import {
  ShieldCheck,
  Wrench,
  Gauge,
  Sparkles,
  Truck,
  CheckCircle2,
  Building2,
  Award,
} from "lucide-react";

type Milestone = {
  year: string;
  title: string;
  description: string;
  badge: string;
};

type StatItem = {
  value: number;
  suffix: string;
  label: string;
  isYear?: boolean;
  prefix?: string;
};

export function AboutPage() {
  const { getText, getJson } = useContent();
  const [selectedBadge, setSelectedBadge] = useState<string>("all");

  const legalName = getText("company.legalName", "Divine Flame and Energy International Limited");
  const aboutText = getText(
    "company.about",
    "Divine Flame and Energy International Limited is an ISO-certified Nigerian oil & gas servicing company specializing in wellhead & Xmas tree equipment, choke valves, wellhead control panels, and preservation services.",
  );
  const aboutExtended = getText(
    "company.aboutExtended",
    "Established in 2003 with headquarters in Lagos and a fully operational 1,500m² field service and warehousing facility in Port Harcourt, DF&E delivers local engineering excellence backed by global OEM standards.",
  );

  const stats = getJson<StatItem[]>("company.stats", [
    { value: 2003, suffix: "", label: "Founded", isYear: true },
    { value: 69, suffix: "+", label: "Field Personnel" },
    { value: 1500, suffix: "m²", label: "Workshop Floor" },
    { value: 30000, suffix: "psi", label: "Max Hydro Testing", prefix: "0–" },
  ]);

  const milestones = getJson<Milestone[]>("about.milestones", [
    {
      year: "2015",
      title: "Agbami Subsea Choke Refurbishment",
      description: "Successfully executed the inspection, strip-down, retrofitting, and high-pressure testing of Chevron Agbami field subsea choke valves in-country.",
      badge: "Subsea Milestone",
    },
    {
      year: "2018",
      title: "Surface Choke Assemblage & Refurbishment",
      description: "Pioneered full in-country assemblage, seat replacement, actuator recalibration, and recertification for major Nigerian JV assets.",
      badge: "Valves Milestone",
    },
    {
      year: "2020",
      title: "Local Wellhead Equipment Assemblage & Testing",
      description: "Achieved 100% in-country assemblage and Factory Acceptance Testing (FAT/SIT) for wellhead & Xmas tree equipment up to 15,000psi in Port Harcourt.",
      badge: "Local Content",
    },
    {
      year: "2022",
      title: "NCEC for Fabrication and Construction (Category 1)",
      description: "Awarded Nigerian Content Equipment Certificate (NCEC) for fabrication, structural assemblage, and mechanical integration.",
      badge: "NCDMB Accredited",
    },
    {
      year: "2023",
      title: "NCEC for Services and Support (Category 1)",
      description: "Certified for provision of well services, maintenance, valve recertification, and intervention engineering.",
      badge: "NCDMB Accredited",
    },
    {
      year: "2024",
      title: "NCEC for Procurement and Supply (Category 1)",
      description: "Certified by NCDMB as a premier Nigerian supplier of wellhead equipment, choke valves, actuators, and critical oilfield materials.",
      badge: "NCDMB Accredited",
    },
  ]);

  const badges = ["all", ...Array.from(new Set(milestones.map((m) => m.badge)))];
  const filteredMilestones = selectedBadge === "all" ? milestones : milestones.filter((m) => m.badge === selectedBadge);

  const FACILITY_SPEC_BLOCKS = [
    {
      icon: Wrench,
      title: "1,500m² Assembly & Repair Workshop",
      description: "Equipped for complete strip-down, mechanical overhaul, valve seat replacement, actuator retrofitting, and local assembly of surface and subsea Xmas trees.",
    },
    {
      icon: Building2,
      title: "1,500m² Equipment & Spares Warehouse",
      description: "High-density heavy-duty racking holding over $10M in fast-moving wellhead spares, ring gaskets, replacement chokes, gate valves, and casing spools.",
    },
    {
      icon: Sparkles,
      title: "Climate-Controlled Elastomer Clean Room",
      description: "Dedicated temperature and humidity regulated clean room preserving critical seals, packing elements, O-rings, and elastomeric components against tropical degradation.",
    },
    {
      icon: Gauge,
      title: "0–30,000psi Hydrostatic & Gas Testing Bays",
      description: "Certified reinforced high-pressure test bunkers equipped with digital data loggers and circular chart recorders for API-6A / API-6D hydrostatic and gas pressure testing.",
    },
    {
      icon: Truck,
      title: "Heavy Lifting & Material Handling",
      description: "High-capacity overhead traveling cranes (up to 20 tons) and specialized heavy-duty forklifts capable of safely maneuvering large wellhead spools and subsea tree assemblies.",
    },
    {
      icon: Sparkles,
      title: "Industrial Blasting & Protective Coating Suite",
      description: "Onsite grit blasting and climate-controlled paint booth applying industrial anti-corrosion barrier coatings and 10-year preservation treatments.",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="About DF&E"
        title="Engineering Discipline, Local Delivery"
        description={`${legalName} — a Nigerian-owned, ISO-certified oil & gas servicing leader built on technical rigor, local content capacity, and OEM partnerships.`}
      />

      {/* ========================================================================= */}
      {/* 1. WHO WE ARE SECTION (REVERTED TO 2-COLUMN PRESENTATION) */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 bg-white border-b border-line">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <Reveal variant={imageReveal} className="aspect-[4/3] overflow-hidden rounded-2xl border border-line shadow-sm">
            <img
              src="/images/about-crane-lift.png"
              alt="Overhead crane lifting a wellhead assembly at the DF&E Port Harcourt workshop"
              className="h-full w-full object-cover"
            />
          </Reveal>

          <Reveal>
            <div className="flex items-center gap-2 text-gold-dark font-mono text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={16} />
              <span>Who We Are</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">Local Might, Global Reach</h2>
            <p className="mt-5 text-ink-soft leading-relaxed">{aboutText}</p>
            <p className="mt-4 text-ink-soft leading-relaxed">{aboutExtended}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-paper-raised border border-line px-3.5 py-1.5 text-xs font-bold text-ink">
                ISO 9001:2015
              </span>
              <span className="rounded-full bg-paper-raised border border-line px-3.5 py-1.5 text-xs font-bold text-ink">
                ISO 14001:2015
              </span>
              <span className="rounded-full bg-paper-raised border border-line px-3.5 py-1.5 text-xs font-bold text-ink">
                ISO 45001:2018
              </span>
              <span className="rounded-full bg-gold/15 border border-gold-dark/30 px-3.5 py-1.5 text-xs font-bold text-gold-ink">
                NCDMB Category 1 NCEC
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4 border-t border-line/60 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-steel font-mono">Certified By:</span>
              <div className="flex items-center gap-3">
                <img
                  src="/images/iso1.png"
                  alt="ISO 9001:2015 Certified Seal"
                  className="h-9 w-auto rounded border border-line bg-white p-1 shadow-xs"
                />
                <img
                  src="/images/iso2.png"
                  alt="ISO 14001:2015 Certified Seal"
                  className="h-9 w-auto rounded border border-line bg-white p-1 shadow-xs"
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* STATS COUNTER BAND */}
      <section className="bg-void py-16">
        <Container className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <CounterUp
                value={stat.value}
                isYear={stat.isYear}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className="block font-mono text-3xl font-bold text-gold md:text-4xl"
              />
              <div className="mt-1 text-xs uppercase tracking-wider text-void-soft font-semibold">{stat.label}</div>
            </div>
          ))}
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. KEY MILESTONES & NCEC ACCREDITATIONS SECTION */}
      {/* ========================================================================= */}
      <section id="milestones" className="py-20 md:py-28 bg-paper">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-gold-dark font-mono text-xs uppercase tracking-widest font-bold">
              <Award size={16} />
              <span>Proven Track Record</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Key Milestones &amp; NCEC Accreditations</h2>
            <p className="mt-3 text-ink-soft leading-relaxed text-sm">
              From landmark subsea choke overhauls on Chevron Agbami to NCDMB Category 1 certifications, our track record reflects steady growth in Nigerian technical capacity.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <button
                key={badge}
                type="button"
                onClick={() => setSelectedBadge(badge)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all ${
                  selectedBadge === badge
                    ? "bg-gold text-gold-ink shadow-sm"
                    : "bg-white border border-line text-ink-soft hover:border-gold-dark hover:text-gold-dark"
                }`}
              >
                {badge === "all" ? "All Milestones" : badge}
              </button>
            ))}
          </div>

          {/* Milestone Cards Grid */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMilestones.map((item, idx) => (
              <div
                key={item.title + idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gold-dark hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xl font-extrabold text-gold-dark">{item.year}</span>
                    <span className="rounded-full bg-paper-raised border border-line/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-steel">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-ink group-hover:text-gold-dark transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-ink-soft leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-steel group-hover:text-gold-dark pt-4 border-t border-line/50">
                  <span>Verified Contract Execution</span>
                  <CheckCircle2 size={13} className="text-gold-dark" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. PORT HARCOURT FACILITY SECTION (#facility) */}
      {/* ========================================================================= */}
      <section id="facility" className="scroll-mt-24 bg-white py-20 md:py-28 border-t border-line">
        <Container>
          {/* Header & Overview */}
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-gold-dark font-mono text-xs uppercase tracking-widest font-bold">
                <Wrench size={15} />
                <span>Port Harcourt Engineering Hub</span>
              </div>
              <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
                Field Service &amp; Warehousing Facility
              </h2>
              <p className="mt-4 text-base text-ink-soft leading-relaxed">
                Located at Trans-Amadi Industrial Layout, Port Harcourt, our comprehensive operations base provides in-country wellhead assemblage, 30,000psi pressure testing bunkers, climate-controlled elastomer storage, and rapid field mobilization.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-line bg-paper-raised p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-steel mb-3">Facility Highlights</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-xl bg-white border border-line p-3">
                    <span className="block font-mono text-xl font-bold text-gold-dark">1,500m²</span>
                    <span className="text-[11px] font-semibold text-steel uppercase">Workshop</span>
                  </div>
                  <div className="rounded-xl bg-white border border-line p-3">
                    <span className="block font-mono text-xl font-bold text-gold-dark">1,500m²</span>
                    <span className="text-[11px] font-semibold text-steel uppercase">Warehouse</span>
                  </div>
                  <div className="rounded-xl bg-white border border-line p-3">
                    <span className="block font-mono text-xl font-bold text-gold-dark">30,000psi</span>
                    <span className="text-[11px] font-semibold text-steel uppercase">Hydro Testing</span>
                  </div>
                  <div className="rounded-xl bg-white border border-line p-3">
                    <span className="block font-mono text-xl font-bold text-gold-dark">24/7</span>
                    <span className="text-[11px] font-semibold text-steel uppercase">Field Dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Panel Authentic Facility Photos Gallery */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Panel 1: Workshop Assembly Floor */}
            <div className="group overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/facility-workshop-wide.png"
                  alt="DF&E Port Harcourt main workshop assembly floor"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-white border-t border-line">
                <div className="text-xs font-bold text-ink">Main Assembly &amp; Overhaul Bay</div>
                <div className="text-[11px] text-steel">1,500m² heavy engineering floor</div>
              </div>
            </div>

            {/* Panel 2: Climate-Controlled Elastomer Storage */}
            <div className="group overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/facility-climate-room.png"
                  alt="Climate-controlled clean room for elastomer and seal storage"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-white border-t border-line">
                <div className="text-xs font-bold text-ink">Climate-Controlled Clean Room</div>
                <div className="text-[11px] text-steel">Preserving seals &amp; elastomeric packings</div>
              </div>
            </div>

            {/* Panel 3: Yard Assembly & Heavy Rigging */}
            <div className="group overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/facility-yard-assembly.png"
                  alt="DF&E wellhead yard staging and testing area"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-white border-t border-line">
                <div className="text-xs font-bold text-ink">Staging &amp; Pressure Testing Yard</div>
                <div className="text-[11px] text-steel">0–30,000psi certified testing bunkers</div>
              </div>
            </div>
          </div>

          {/* 6-Block Detailed Technical Infrastructure Grid */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITY_SPEC_BLOCKS.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.title}
                  className="rounded-2xl border border-line bg-paper-raised/60 p-7 shadow-xs hover:border-gold-dark hover:bg-white transition-all duration-200"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-dark border border-gold/30">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-ink">{spec.title}</h3>
                  <p className="mt-2 text-xs text-ink-soft leading-relaxed">{spec.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <Partners />
      <CtaBand />
    </>
  );
}

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { CtaBand } from "@/components/sections/CtaBand";
import { useContent } from "@/features/content/hooks/useContent";
import {
  Search,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  Phone,
  ArrowRight,
} from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
  category: string;
  linkText?: string;
  linkHref?: string;
};

export function FaqPage() {
  const { getJson } = useContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = getJson<FaqItem[]>("faq.items", [
    {
      question: "What are Divine Flame & Energy's primary engineering capabilities?",
      answer:
        "DF&E specializes in procurement, supply, local assemblage, inspection, high-pressure testing, overhauls, and field maintenance of Wellheads & Xmas Trees (surface and subsea), Choke Valves, Wellhead Control Panels (WHCP), Fishing & Re-entry Tools, Sealant Injection, and Oilfield Equipment Preservation.",
      category: "Capabilities",
      linkText: "Explore Technical Services",
      linkHref: "/services",
    },
    {
      question: "What pressure ratings can your Port Harcourt facility test and certify?",
      answer:
        "Our reinforced high-pressure testing bunkers in Port Harcourt are certified for hydrostatic and gas pressure testing from 0 to 30,000psi, equipped with digital data logging and circular chart recorders in full compliance with API-6A and API-6D standards.",
      category: "Facility & Testing",
      linkText: "View Facility Specs",
      linkHref: "/about#facility",
    },
    {
      question: "Is DF&E fully certified under ISO and Nigerian Content (NCDMB) regulations?",
      answer:
        "Yes. DF&E is independently audited and certified under ISO 9001:2015 (Quality), ISO 14001:2015 (Environment), and ISO 45001:2018 (Occupational Health & Safety). We also hold Nigerian Content Equipment Certificates (NCEC Category 1) for Fabrication & Construction, Services & Support, and Procurement.",
      category: "Compliance & Quality",
      linkText: "View ISO Certificates",
      linkHref: "/certifications",
    },
    {
      question: "Can DF&E perform subsea and surface choke valve overhauls entirely in Nigeria?",
      answer:
        "Yes. We have a proven track record including landmark overhauls of Chevron Agbami field subsea choke valves. Our workshop conducts strip-down, inspection, tungsten carbide trim replacement, seat renewal, pneumatic/hydraulic actuator recalibration, and Factory Acceptance Testing (FAT) without exporting assets abroad.",
      category: "Capabilities",
      linkText: "View Choke Valve Services",
      linkHref: "/services/choke-valve",
    },
    {
      question: "Where is DF&E's field workshop and warehouse facility located?",
      answer:
        "Our comprehensive 1,500m² workshop and 1,500m² warehousing hub is located at Plot 45 Trans-Amadi Industrial Layout, Port Harcourt, Rivers State. Corporate headquarters are situated in Victoria Island, Lagos.",
      category: "Facility & Testing",
      linkText: "Get Workshop Directions",
      linkHref: "/contact",
    },
    {
      question: "How does DF&E protect elastomers and seals against tropical degradation?",
      answer:
        "Our Port Harcourt facility houses a dedicated climate-controlled clean room with strict 24/7 temperature and humidity regulation. This prevents premature aging, embrittlement, and ozone damage to critical O-rings, packings, and elastomeric seals for up to 10 years.",
      category: "Preservation",
      linkText: "Explore Preservation Tech",
      linkHref: "/services/equipment-preservation",
    },
    {
      question: "How quickly can DF&E mobilize field engineers for emergency intervention?",
      answer:
        "We maintain 24/7 rapid mobilization protocols with a workforce of over 69 qualified engineers and technicians equipped with dedicated tooling for onshore, swamp, and deepwater offshore facilities across the Niger Delta.",
      category: "Field Mobilization",
      linkText: "Contact 24/7 Support Desk",
      linkHref: "/contact",
    },
    {
      question: "How does the Equipment Preservation solution deliver 10+ year longevity?",
      answer:
        "We combine Guardian protective barrier chemical treatments, precision buffing/de-rusting, and heavy-duty 22oz custom-tailored vinyl protective jackets and straps. Proven on multi-million dollar assets for ExxonMobil, EOG Resources, and Chevron.",
      category: "Preservation",
      linkText: "View Preservation Case Studies",
      linkHref: "/services/equipment-preservation",
    },
    {
      question: "What OEM brands does DF&E partner with for wellhead equipment and spares?",
      answer:
        "We maintain authorized sourcing partnerships with leading global manufacturers including Master Flo, TechnipFMC, Ameriforge, GE Oil & Gas, National Oilwell Varco (NOV), and SCV, ensuring 100% genuine OEM spares and full material traceability.",
      category: "Procurement & Spares",
      linkText: "View OEM Partners",
      linkHref: "/about",
    },
  ]);

  const categories = ["all", ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchesCat = selectedCategory === "all" || f.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <>
      <PageHeader
        eyebrow="Help & Knowledge Base"
        title="Frequently Asked Questions"
        description="Clear answers regarding DF&E's technical capabilities, 30,000psi testing bays, ISO 9001/14001/45001 governance, NCDMB Category 1 compliance, and 24/7 field deployment."
      />

      <Container className="py-16 md:py-24 max-w-5xl">
        {/* TOP SEARCH & TOPIC FILTER BAR */}
        <div className="rounded-3xl border border-line bg-paper-raised p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. hydro testing, subsea choke, NCDMB, ISO)..."
                className="w-full rounded-2xl border border-line bg-white py-3 pl-11 pr-4 text-xs font-medium text-ink placeholder:text-steel focus:border-gold-dark focus:outline-none shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-steel hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Total Results Count */}
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-steel">
              Showing <span className="text-gold-dark font-extrabold">{filteredFaqs.length}</span> of {faqs.length} Answers
            </div>
          </div>

          {/* Topic Category Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-2 pt-6 border-t border-line/70">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gold text-gold-ink shadow-sm"
                    : "border border-line bg-white text-ink-soft hover:border-gold-dark hover:text-gold-dark"
                }`}
              >
                {cat === "all" ? "All Topics" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* ACCORDION FAQ ITEMS LIST */}
        <div className="mt-10 space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question + idx}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-gold-dark bg-white shadow-md"
                    : "border-line bg-white shadow-xs hover:border-gold-dark/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 md:p-7 text-left cursor-pointer gap-4"
                >
                  <span className="text-base md:text-lg font-bold text-ink leading-snug">
                    {faq.question}
                  </span>
                  <div className="flex items-center gap-3 flex-none">
                    <span className="hidden sm:inline-block rounded-full bg-paper-raised border border-line px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-steel">
                      {faq.category}
                    </span>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                        isOpen
                          ? "bg-gold text-gold-ink border-gold rotate-180"
                          : "border-line text-steel group-hover:border-gold-dark"
                      }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-line/60 bg-paper-raised/40 p-6 md:p-7 pt-4 text-sm text-ink-soft leading-relaxed space-y-4">
                    <p>{faq.answer}</p>
                    {faq.linkHref && (
                      <div className="pt-2">
                        <Link
                          to={faq.linkHref}
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-dark hover:text-gold-ink hover:underline"
                        >
                          <span>{faq.linkText || "Learn More"}</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="rounded-3xl border border-dashed border-line bg-paper-raised p-12 text-center">
              <HelpCircle size={36} className="mx-auto text-steel" />
              <h3 className="mt-3 text-lg font-bold text-ink">No matching questions found</h3>
              <p className="mt-1 text-xs text-steel max-w-[40ch] mx-auto">
                Couldn't find what you're looking for? Reach out directly to our engineering support desk.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-5 rounded-full bg-gold px-5 py-2 text-xs font-bold uppercase text-gold-ink hover:bg-gold-light transition-colors"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM DIRECT ENGINEERING SUPPORT BANNER */}
        <div className="mt-16 rounded-3xl border border-line bg-void text-white p-8 md:p-10 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold uppercase tracking-widest">
                <MessageSquare size={16} />
                <span>Technical Advisory</span>
              </div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">Have a Project-Specific Technical Inquiry?</h3>
              <p className="text-xs md:text-sm text-void-soft leading-relaxed">
                Our senior wellhead specialists and valve engineers in Lagos and Port Harcourt are available to review scopes of work, FAT schedules, and quotation packages.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-colors text-center"
              >
                <span>Submit Technical RFP</span>
                <ArrowRight size={14} />
              </Link>
              <a
                href="tel:+2348033285741"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-void-line px-6 py-3 text-xs font-bold uppercase tracking-wider text-void-soft hover:text-white transition-colors text-center"
              >
                <Phone size={14} />
                <span>Direct: +234 803 328 5741</span>
              </a>
            </div>
          </div>
        </div>
      </Container>

      <CtaBand />
    </>
  );
}

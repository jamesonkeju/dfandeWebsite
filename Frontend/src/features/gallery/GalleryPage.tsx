import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { Pagination } from "@/components/ui/Pagination";
import { galleryImages, type GalleryCategory } from "@/data/mock/gallery";

const FILTERS: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Field Operations", label: "Field Operations" },
  { value: "Equipment & Products", label: "Equipment & Products" },
  { value: "Platforms & Facilities", label: "Platforms & Facilities" },
];

const PAGE_SIZE = 16;

export function GalleryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const [page, setPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = filter === "all" ? galleryImages : galleryImages.filter((img) => img.category === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const active = activeIndex !== null ? pageItems[activeIndex] : null;

  function changeFilter(value: (typeof FILTERS)[number]["value"]) {
    setFilter(value);
    setPage(1);
  }

  function changePage(next: number) {
    setPage(Math.min(Math.max(1, next), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i === null ? null : (i + 1) % pageItems.length));
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i === null ? null : (i - 1 + pageItems.length) % pageItems.length));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, pageItems.length]);

  return (
    <>
      <PageHeader
        eyebrow="Photo Gallery"
        title="Field Work, Equipment & Facilities"
        description="A photographic record of DF&E's field operations, equipment and platform work across Nigeria's oil & gas sector."
      />

      <Container className="py-16 md:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => changeFilter(f.value)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                  filter === f.value
                    ? "border-gold-dark bg-gold text-gold-ink"
                    : "border-line text-ink-soft hover:border-gold-dark hover:text-gold-dark"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-steel">
            {filtered.length} {filtered.length === 1 ? "Photo" : "Photos"}
          </p>
        </div>

        {/* key={filter+page} forces a clean remount on filter/page change, and
            the grid itself only mounts once images exist — same StaggerGroup
            whileInView pitfalls as the Projects/Products pages. */}
        <StaggerGroup key={`${filter}-${page}`} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pageItems.map((img, index) => (
            <StaggerItem key={img.src}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group block aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-paper-raised"
              >
                <img
                  src={img.thumb}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination page={page} totalPages={totalPages} onChange={changePage} />
          </div>
        )}
      </Container>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-void/95 p-4 md:p-10"
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full border border-white/20 p-2 text-white hover:border-gold hover:text-gold"
            >
              <X size={20} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i === null ? null : (i - 1 + pageItems.length) % pageItems.length));
              }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-2 text-white hover:border-gold hover:text-gold md:left-6"
            >
              <ChevronLeft size={22} />
            </button>

            <motion.figure
              key={active.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-full max-w-4xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={active.src} alt={active.alt} className="max-h-[75vh] rounded-lg object-contain" />
              <figcaption className="mt-4 text-center text-sm text-void-soft">
                {active.alt}
                <span className="ml-3 text-xs uppercase tracking-wide text-steel">{active.category}</span>
              </figcaption>
            </motion.figure>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i === null ? null : (i + 1) % pageItems.length));
              }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-2 text-white hover:border-gold hover:text-gold md:right-6"
            >
              <ChevronRight size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

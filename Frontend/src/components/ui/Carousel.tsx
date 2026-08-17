import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Native scroll-snap carousel — no per-breakpoint item-count math, no slide
 * index bookkeeping. Callers control how many cards are visible purely via
 * width classes on each child (e.g. "w-[85%] sm:w-[46%] lg:w-[31%]"), and
 * get free trackpad/touch scrolling alongside the arrow buttons. Progress
 * is shown as a slim bar rather than one-dot-per-item, since dot count
 * would be wrong the moment the viewport shows more than one card.
 */
export function Carousel({ children, className }: { children: ReactNode[]; className?: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  function updateScrollState() {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft < maxScroll - 8);
    setProgress(maxScroll <= 0 ? 1 : Math.min(1, el.scrollLeft / maxScroll));
  }

  useEffect(() => {
    updateScrollState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.length]);

  function scrollByDirection(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.92, behavior: "smooth" });
  }

  return (
    <div className={className}>
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <div className="mt-7 flex items-center gap-5">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gold-dark transition-[width] duration-300"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <div className="flex flex-none gap-2">
          <button
            type="button"
            onClick={() => scrollByDirection(-1)}
            disabled={!canScrollPrev}
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold-dark hover:text-gold-dark disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection(1)}
            disabled={!canScrollNext}
            aria-label="Next"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold-dark hover:text-gold-dark disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CarouselItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex-none snap-start", className)}>{children}</div>;
}

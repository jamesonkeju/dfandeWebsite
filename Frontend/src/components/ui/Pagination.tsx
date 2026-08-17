import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Small page counts (this app's use cases stay well under ~10) don't need
  // ellipsis truncation — every page number is shown directly.
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold-dark hover:text-gold-dark disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page}
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-bold transition-colors ${
            p === page ? "bg-gold text-gold-ink" : "text-ink-soft hover:bg-paper-raised"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold-dark hover:text-gold-dark disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

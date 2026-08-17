import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  Circle,
  ExternalLink,
  Package,
} from "lucide-react";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useSetProductPublishedMutation,
} from "@/features/products/api/productsApi";

export function ProductsListPage() {
  const { data: products, isLoading, isError } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [setPublished] = useSetProductPublishedMutation();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  const filteredProducts = useMemo(() => {
    return (products ?? []).filter((p) => {
      const matchQuery =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        (p.application ?? "").toLowerCase().includes(search.toLowerCase()) ||
        p.items.some((it) => it.toLowerCase().includes(search.toLowerCase()));

      if (!matchQuery) return false;
      if (activeTab === "PUBLISHED") return p.isPublished;
      if (activeTab === "DRAFT") return !p.isPublished;
      return true;
    });
  }, [products, search, activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-dark">
            <Package size={15} />
            <span>Commercial Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-ink">Products Management</h1>
          <p className="mt-0.5 text-xs text-steel">
            Manage product equipment packages, specifications, and bill of materials for the public website.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink shadow-xs transition-all hover:bg-gold-light cursor-pointer"
        >
          <Plus size={15} />
          <span>New Product</span>
        </Link>
      </div>

      {/* Toolbar: Search & Status Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, slug, application, or components…"
            className="w-full rounded-xl border border-line bg-paper-raised py-2 pl-10 pr-4 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "ALL"
                ? "bg-gold text-gold-ink shadow-2xs"
                : "text-steel hover:bg-paper hover:text-ink"
            }`}
          >
            All ({(products ?? []).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PUBLISHED")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "PUBLISHED"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-steel hover:bg-paper hover:text-ink"
            }`}
          >
            Published ({(products ?? []).filter((p) => p.isPublished).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("DRAFT")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "DRAFT"
                ? "bg-steel text-white shadow-2xs"
                : "text-steel hover:bg-paper hover:text-ink"
            }`}
          >
            Draft ({(products ?? []).filter((p) => !p.isPublished).length})
          </button>
        </div>
      </div>

      {/* Products Grid / Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-2xs">
        {isLoading && (
          <div className="p-12 text-center text-xs text-steel">Loading product packages…</div>
        )}
        {isError && (
          <div className="p-12 text-center text-xs text-danger">
            Could not load products. Please ensure the backend is running.
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div className="p-12 text-center text-xs text-steel">
            No products found matching your search criteria.
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length > 0 && (
          <div className="divide-y divide-line">
            {filteredProducts.map((product) => {
              const previewImg = product.imageUrl || "/images/product-wellhead-equipment.jpg";

              return (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 p-4 transition-colors hover:bg-paper-raised/50 sm:flex-row sm:items-center sm:gap-6"
                >
                  {/* Thumbnail */}
                  <div className="relative h-18 w-26 flex-none overflow-hidden rounded-xl border border-line bg-paper-raised shadow-2xs">
                    <img
                      src={previewImg}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/product-wellhead-equipment.jpg";
                      }}
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                      #{product.displayOrder}
                    </span>
                  </div>

                  {/* Main Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-bold text-ink">{product.title}</h2>
                      <span className="rounded bg-paper-raised px-2 py-0.5 font-mono text-[10px] text-steel">
                        /{product.slug}
                      </span>
                    </div>

                    <p className="line-clamp-1 text-xs text-steel">
                      {product.application || "General upstream & surface equipment package."}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-steel">
                        Includes:
                      </span>
                      {product.items.slice(0, 3).map((it, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-paper px-2 py-0.5 text-[10px] font-medium text-ink"
                        >
                          {it}
                        </span>
                      ))}
                      {product.items.length > 3 && (
                        <span className="text-[10px] font-bold text-steel">
                          +{product.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status Controls */}
                  <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                    {/* Live Page Link */}
                    <a
                      href={`/products#${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-2.5 py-1.5 text-[11px] font-bold text-steel hover:border-gold-dark hover:text-gold-dark cursor-pointer transition-colors"
                      title="View public product card"
                    >
                      <ExternalLink size={12} />
                      <span className="hidden md:inline">Live Page</span>
                    </a>

                    {/* Publish Status Toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setPublished({
                          id: product.id,
                          isPublished: !product.isPublished,
                        })
                      }
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        product.isPublished
                          ? "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "border border-line bg-paper-raised text-steel hover:bg-paper"
                      }`}
                      title="Click to toggle publish status"
                    >
                      {product.isPublished ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <Circle size={13} className="text-steel" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>

                    {/* Edit Button */}
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-gold-dark hover:text-gold-dark cursor-pointer transition-colors shadow-2xs"
                      aria-label={`Edit ${product.title}`}
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </Link>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            `Delete product package "${product.title}"? This cannot be undone.`
                          )
                        ) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="inline-flex items-center rounded-xl border border-line bg-white p-2 text-steel hover:border-danger hover:text-danger cursor-pointer transition-colors shadow-2xs"
                      aria-label={`Delete ${product.title}`}
                      title="Delete Product"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

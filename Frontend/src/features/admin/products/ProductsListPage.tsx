import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useSetProductPublishedMutation,
} from "@/features/products/api/productsApi";

export function ProductsListPage() {
  const { data: products, isLoading, isError } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [setPublished] = useSetProductPublishedMutation();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink-soft">Product families shown on the public /products page.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-gold-ink hover:bg-gold-dark"
        >
          <Plus size={16} />
          New Product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        {isLoading && <p className="p-6 text-sm text-ink-soft">Loading…</p>}
        {isError && <p className="p-6 text-sm text-danger">Couldn't load products. Is the API running?</p>}

        {products?.map((product) => (
          <div key={product.id} className="flex items-center gap-4 border-b border-line p-4 last:border-b-0">
            <span className="w-10 flex-none text-xs font-bold text-steel">#{product.displayOrder}</span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">{product.title}</p>
              <p className="truncate text-xs text-steel">/{product.slug}</p>
            </div>

            <button
              type="button"
              onClick={() => setPublished({ id: product.id, isPublished: !product.isPublished })}
              className={`flex-none rounded-full px-2.5 py-1 text-xs font-bold ${
                product.isPublished ? "bg-verify/15 text-verify" : "bg-line text-steel"
              }`}
            >
              {product.isPublished ? "Published" : "Draft"}
            </button>

            <Link
              to={`/admin/products/${product.id}/edit`}
              className="flex-none rounded-full border border-line p-2 text-ink-soft hover:border-gold-dark hover:text-gold-dark"
              aria-label={`Edit ${product.title}`}
            >
              <Pencil size={15} />
            </Link>

            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete "${product.title}"? This can't be undone.`)) {
                  deleteProduct(product.id);
                }
              }}
              className="flex-none rounded-full border border-line p-2 text-ink-soft hover:border-danger hover:text-danger"
              aria-label={`Delete ${product.title}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

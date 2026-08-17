import { api } from "@/app/api";

export type Product = {
  id: string;
  title: string;
  slug: string;
  items: string[];
  application: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
};

export type ProductFormValues = {
  title: string;
  slug: string;
  items: string[];
  application: string;
  imageUrl: string;
  displayOrder: number;
  isPublished: boolean;
};

type ListResponse = { success: boolean; data: Product[] };

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public — the /products page.
    getPublishedProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (response: ListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((p) => ({ type: "Product" as const, id: p.id })), { type: "Product" as const, id: "LIST" }]
          : [{ type: "Product" as const, id: "LIST" }],
    }),

    // CMS-only.
    getAllProducts: builder.query<Product[], void>({
      query: () => "/products/all",
      transformResponse: (response: ListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((p) => ({ type: "Product" as const, id: p.id })), { type: "Product" as const, id: "LIST" }]
          : [{ type: "Product" as const, id: "LIST" }],
    }),

    createProduct: builder.mutation<{ id: string }, ProductFormValues>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<void, { id: string } & ProductFormValues>({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: "PUT", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }, { type: "Product", id: "LIST" }],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    setProductPublished: builder.mutation<void, { id: string; isPublished: boolean }>({
      query: ({ id, isPublished }) => ({ url: `/products/${id}/publish`, method: "PATCH", body: { isPublished } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }, { type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPublishedProductsQuery,
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSetProductPublishedMutation,
} = productsApi;

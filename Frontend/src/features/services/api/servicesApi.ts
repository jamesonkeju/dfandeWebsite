import { api } from "@/app/api";

export type ServiceIcon = "flame" | "gauge" | "settings" | "anchor" | "droplet" | "shield" | "lock" | "package";

export type Service = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  scope: string[];
  icon: string;
  imageUrl: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
};

export type ServiceFormValues = {
  title: string;
  slug: string;
  summary: string;
  scope: string[];
  icon: string;
  imageUrl: string;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
};

type ListResponse = { success: boolean; data: Service[] };
type SingleResponse = { success: boolean; data: Service };

export const servicesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public — homepage and (future) public /services page.
    getPublishedServices: builder.query<Service[], void>({
      query: () => "/services",
      transformResponse: (response: ListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((s) => ({ type: "Service" as const, id: s.id })), { type: "Service" as const, id: "LIST" }]
          : [{ type: "Service" as const, id: "LIST" }],
    }),

    // Public — a single published service by slug (service detail page).
    getServiceBySlug: builder.query<Service, string>({
      query: (slug) => `/services/${slug}`,
      transformResponse: (response: SingleResponse) => response.data,
      providesTags: (_result, _error, slug) => [{ type: "Service", id: slug }],
    }),

    // CMS-only.
    getAllServices: builder.query<Service[], void>({
      query: () => "/services/all",
      transformResponse: (response: ListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((s) => ({ type: "Service" as const, id: s.id })), { type: "Service" as const, id: "LIST" }]
          : [{ type: "Service" as const, id: "LIST" }],
    }),

    createService: builder.mutation<{ id: string }, ServiceFormValues>({
      query: (body) => ({ url: "/services", method: "POST", body }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    updateService: builder.mutation<void, { id: string } & ServiceFormValues>({
      query: ({ id, ...body }) => ({ url: `/services/${id}`, method: "PUT", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Service", id }, { type: "Service", id: "LIST" }],
    }),

    deleteService: builder.mutation<void, string>({
      query: (id) => ({ url: `/services/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    setServicePublished: builder.mutation<void, { id: string; isPublished: boolean }>({
      query: ({ id, isPublished }) => ({ url: `/services/${id}/publish`, method: "PATCH", body: { isPublished } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Service", id }, { type: "Service", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPublishedServicesQuery,
  useGetServiceBySlugQuery,
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useSetServicePublishedMutation,
} = servicesApi;

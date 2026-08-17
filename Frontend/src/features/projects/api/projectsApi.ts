import { api } from "@/app/api";

export type ProjectCategory = "wellhead" | "control-panel" | "choke-valve";

export type Project = {
  id: string;
  client: string;
  scope: string;
  location: string;
  year: string;
  category: string;
  imageUrl: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
};

export type ProjectFormValues = {
  client: string;
  scope: string;
  location: string;
  year: string;
  category: string;
  imageUrl: string;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
};

type ListResponse = { success: boolean; data: Project[] };

export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public — the /projects page and the homepage's featured section.
    getPublishedProjects: builder.query<Project[], void>({
      query: () => "/projects",
      transformResponse: (response: ListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((p) => ({ type: "Project" as const, id: p.id })), { type: "Project" as const, id: "LIST" }]
          : [{ type: "Project" as const, id: "LIST" }],
    }),

    // CMS-only.
    getAllProjects: builder.query<Project[], void>({
      query: () => "/projects/all",
      transformResponse: (response: ListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((p) => ({ type: "Project" as const, id: p.id })), { type: "Project" as const, id: "LIST" }]
          : [{ type: "Project" as const, id: "LIST" }],
    }),

    createProject: builder.mutation<{ id: string }, ProjectFormValues>({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    updateProject: builder.mutation<void, { id: string } & ProjectFormValues>({
      query: ({ id, ...body }) => ({ url: `/projects/${id}`, method: "PUT", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Project", id }, { type: "Project", id: "LIST" }],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    setProjectPublished: builder.mutation<void, { id: string; isPublished: boolean }>({
      query: ({ id, isPublished }) => ({ url: `/projects/${id}/publish`, method: "PATCH", body: { isPublished } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Project", id }, { type: "Project", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPublishedProjectsQuery,
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useSetProjectPublishedMutation,
} = projectsApi;

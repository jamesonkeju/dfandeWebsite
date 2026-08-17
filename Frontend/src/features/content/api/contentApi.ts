import { api } from "@/app/api";

export type ContentValueType = "PlainText" | "RichText" | "List" | "Json";

export type ContentBlock = {
  id: string;
  key: string;
  pageGroup: string;
  valueType: ContentValueType;
  displayLabel: string;
  helpText: string | null;
  displayOrder: number;
  textValue: string | null;
  listValue: string[] | null;
  jsonValue: string | null;
};

export type ContentBlockUpdateItem = {
  key: string;
  textValue?: string | null;
  listValue?: string[] | null;
  jsonValue?: string | null;
};

type ListResponse = { success: boolean; data: ContentBlock[] };

export const contentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public — every content block, flat. No draft/publish split for site
    // copy, so this one query serves both the public site and the admin
    // content editor.
    getContentBlocks: builder.query<ContentBlock[], void>({
      query: () => "/contentblocks",
      transformResponse: (response: ListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((c) => ({ type: "ContentBlock" as const, id: c.key })), { type: "ContentBlock" as const, id: "LIST" }]
          : [{ type: "ContentBlock" as const, id: "LIST" }],
    }),

    updateContentBlocks: builder.mutation<ContentBlock[], { pageGroup: string; blocks: ContentBlockUpdateItem[] }>({
      query: ({ pageGroup, blocks }) => ({
        url: `/contentblocks/${pageGroup}`,
        method: "PUT",
        body: { blocks },
      }),
      transformResponse: (response: ListResponse) => response.data,
      invalidatesTags: [{ type: "ContentBlock", id: "LIST" }],
    }),
  }),
});

export const { useGetContentBlocksQuery, useUpdateContentBlocksMutation } = contentApi;

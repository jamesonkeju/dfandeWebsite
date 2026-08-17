import { api } from "@/app/api";

export type ContactFormValues = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  serviceOfInterest?: string;
};

export type ContactSubmissionStatus = "New" | "Read" | "Responded" | "Archived";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  serviceOfInterest: string | null;
  status: ContactSubmissionStatus;
  createdAt: string;
};

type SubmitContactResponse = {
  success: boolean;
  data: { id: string };
  message: string;
};

type GetSubmissionsResponse = {
  success: boolean;
  data: ContactSubmission[];
};

type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitContact: builder.mutation<SubmitContactResponse, ContactFormValues>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
    }),

    // CMS-only — the API rejects these without an Administrator/Super Admin token.
    getContactSubmissions: builder.query<ContactSubmission[], void>({
      query: () => "/contact",
      transformResponse: (response: GetSubmissionsResponse) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((s) => ({ type: "ContactSubmission" as const, id: s.id })), { type: "ContactSubmission" as const, id: "LIST" }]
          : [{ type: "ContactSubmission" as const, id: "LIST" }],
    }),

    updateContactSubmissionStatus: builder.mutation<void, { id: string; status: ContactSubmissionStatus }>({
      query: ({ id, status }) => ({
        url: `/contact/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "ContactSubmission", id }, { type: "ContactSubmission", id: "LIST" }],
    }),
  }),
});

export const { useSubmitContactMutation, useGetContactSubmissionsQuery, useUpdateContactSubmissionStatusMutation } = contactApi;
export type { ApiErrorResponse };

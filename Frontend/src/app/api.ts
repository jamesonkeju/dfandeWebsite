import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { logout } from "@/features/admin/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wraps fetchBaseQuery so an expired/invalid token (401 from any CMS-only
// endpoint) clears the stored session instead of leaving the admin stuck
// silently re-sending a dead token on every request.
const baseQueryWithAuthHandling: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

// Base slice with no endpoints of its own — features inject their own
// endpoints via api.injectEndpoints (see features/contact/api/contactApi.ts)
// so each feature owns its slice of the API surface.
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ["ContactSubmission", "Service", "Product", "Project", "ContentBlock", "Analytics"],
  endpoints: () => ({}),
});

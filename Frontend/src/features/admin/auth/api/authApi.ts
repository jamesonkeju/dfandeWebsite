import { api } from "@/app/api";

export type LoginRequest = { email: string; password: string };

type LoginResponse = {
  success: boolean;
  data: { token: string; displayName: string; roles: string[] };
  message: string | null;
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
  }),
});

export const { useLoginMutation } = authApi;

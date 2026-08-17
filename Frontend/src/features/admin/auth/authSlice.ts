import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

const STORAGE_KEY = "dfande_cms_auth";

export type AuthState = {
  token: string | null;
  displayName: string | null;
  roles: string[];
};

function loadPersisted(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, displayName: null, roles: [] };
    return JSON.parse(raw) as AuthState;
  } catch {
    return { token: null, displayName: null, roles: [] };
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadPersisted(),
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.displayName = action.payload.displayName;
      state.roles = action.payload.roles;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    logout: (state) => {
      state.token = null;
      state.displayName = null;
      state.roles = [];
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token);

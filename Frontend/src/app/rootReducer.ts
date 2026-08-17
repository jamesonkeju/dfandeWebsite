import { combineReducers } from "@reduxjs/toolkit";
import { api } from "./api";
import { authReducer } from "@/features/admin/auth/authSlice";

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
});

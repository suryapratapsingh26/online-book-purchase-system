import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export type User = { id: string; email: string };
export type Book = { id: string; title: string; author: string; description: string; price: string; coverImage: string | null };
export type Order = { id: string; bookId: string; amount: string; status: "PENDING" | "PAID" | "CANCELLED" | "FAILED"; createdAt: string; book: Pick<Book, "id" | "title" | "author" | "coverImage"> };

type ApiResponse<T> = { data: T };
type AuthResult = { token: string; user: User };
type PaymentOrder = { id: string; amount: number; currency: string; keyId: string };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const api = createApi({
  reducerPath: "bookstoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).session.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Session", "Books", "Orders"],
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<{ user: User }>, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    login: builder.mutation<ApiResponse<AuthResult>, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Session"],
    }),
    me: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => "/auth/me",
      providesTags: ["Session"],
    }),
    books: builder.query<ApiResponse<Book[]>, void>({
      query: () => "/books",
      providesTags: ["Books"],
    }),
    orders: builder.query<ApiResponse<Order[]>, void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation<ApiResponse<Order>, { bookId: string }>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: ["Orders"],
    }),
    createPaymentOrder: builder.mutation<ApiResponse<PaymentOrder>, { orderId: string }>({
      query: (body) => ({ url: "/payments/create-order", method: "POST", body }),
    }),
    verifyPayment: builder.mutation<ApiResponse<{ orderId: string; status: string }>, Record<string, string>>({
      query: (body) => ({ url: "/payments/verify", method: "POST", body }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  useBooksQuery,
  useOrdersQuery,
  useCreateOrderMutation,
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
} = api;
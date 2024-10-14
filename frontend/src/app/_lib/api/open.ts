"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Comments } from "../type";
import { RootState } from "../store";
import { LS_TOKEN_NAME } from "../utils/constants";

export const openApi = createApi({
  reducerPath: "openApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/open`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(LS_TOKEN_NAME);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["OpenPost", "OpenPopular"],
  endpoints: (builder) => ({
    getTopPost: builder.query({
      query: (params?: Record<string, any>) => ({ url: "/top-post", params }),
      providesTags: ["OpenPost"],
    }),
    getPost: builder.query({
      query: (id) => ({ url: `/${id}` }),
    }),
    getTopUsers: builder.query({
      query: () => ({ url: "/top-users" }),
      providesTags: ["OpenPopular"],
    }),
  }),
});

export const {
  useGetTopPostQuery,
  useLazyGetTopPostQuery,
  useGetPostQuery,
  useLazyGetPostQuery,
  useGetTopUsersQuery,
  useLazyGetTopUsersQuery,
} = openApi;

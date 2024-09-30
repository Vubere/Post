"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Notification } from "../type";
import { RootState } from "../store";
import { LS_TOKEN_NAME } from "../utils/constants";
import { create } from "lodash";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/notifications`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(LS_TOKEN_NAME);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Notifications",
    "Notifications",
    "Popular",
    "Praises",
    "Bookmarks",
    "Following",
    "Popular",
  ],
  endpoints: (builder) => ({
    markNotificationAsRead: builder.mutation({
      query: (id: string) => ({
        url: `/mark-as-read/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
    getNotifications: builder.query({
      query: (params?: Record<string, any>) => ({
        url: "",
        params: params,
      }),
    }),
    createNotification: builder.mutation({
      query: (data: Notification) => ({
        url: "/",
        body: data,
      }),
    }),
  }),
});

export const {
  useMarkNotificationAsReadMutation,
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useCreateNotificationMutation,
} = notificationApi;
export const {} = notificationApi.endpoints;

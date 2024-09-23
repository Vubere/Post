"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Comments } from "../type";
import { RootState } from "../store";
import { LS_TOKEN_NAME } from "../utils/constants";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/comments`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(LS_TOKEN_NAME);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Comments",
    "Comments",
    "Popular",
    "Praises",
    "Bookmarks",
    "Following",
    "Popular",
  ],
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (data: Comments) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),
    updateComment: builder.mutation({
      query: ({ id, ...data }: Comments) => ({
        url: `/${id}`,
        method: "PATCH",
        body: { id, ...data },
      }),
      invalidatesTags: ["Comments"],
    }),
    deleteComment: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
    getPostComments: builder.query({
      query: (params?: { postId: string }) => ({
        url: "",
        params,
      }),
      providesTags: ["Comments"],
    }),
    getComment: builder.query({
      query: (id) => `/${id}`,
    }),
    getPraise: builder.query({
      query: () => "/praises",
      providesTags: ["Praises"],
    }),
    praiseComment: builder.mutation({
      query: (id: string) => ({
        url: `/praise/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Praises"],
    }),
    unPraiseComment: builder.mutation({
      query: (id: string) => ({
        url: `/praise/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Praises"],
    }),
    getBookmarks: builder.query({
      query: () => "/bookmarks",
      providesTags: ["Bookmarks"],
    }),
    bookmarkComment: builder.mutation<"Bookmarks", string>({
      query: (id: string) => ({
        url: `/bookmark/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    unBookmarkComment: builder.mutation<"Bookmarks", string>({
      query: (id: string) => ({
        url: `/bookmark/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    clickComment: builder.mutation({
      query: (id: string) => ({
        url: `/click/${id}`,
        method: "POST",
      }),
    }),
    viewComment: builder.mutation({
      query: (id: string) => ({
        url: `/unsubscribe/${id}`,
        method: "POST",
      }),
    }),
    readComment: builder.mutation({
      query: (id: string) => ({
        url: `/unsubscribe/${id}`,
        method: "POST",
      }),
    }),
    replyComment: builder.mutation({
      query: (data: Comments) => ({
        url: `/reply/${data?.commentRepliedTo}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetBookmarksQuery,
  useGetPraiseQuery,
  useGetCommentQuery,
  usePraiseCommentMutation,
  useBookmarkCommentMutation,
  useClickCommentMutation,
  useDeleteCommentMutation,
  useReadCommentMutation,
  useViewCommentMutation,
  useUpdateCommentMutation,
  useUnPraiseCommentMutation,
  useUnBookmarkCommentMutation,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
  useReplyCommentMutation,
} = commentApi;
export const {
  createComment,
  updateComment,
  deleteComment,
  getComment,
  getPraise,
  praiseComment,
  unPraiseComment,
  bookmarkComment,
  unBookmarkComment,
  getBookmarks,
  viewComment,
  clickComment,
  readComment,
  getPostComments,
} = commentApi.endpoints;

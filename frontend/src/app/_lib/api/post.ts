"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post, PostPayload } from "../type";
import { RootState } from "../store";
import { LS_TOKEN_NAME } from "../utils/constants";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/posts`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(LS_TOKEN_NAME);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Post",
    "Post",
    "Token",
    "Feed",
    "Interest",
    "Popular",
    "Post",
    "Subscriptions",
    "Bookmarks",
    "Following",
    "Popular",
    "Categories",
  ],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data: PostPayload) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Token", "Feed"],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...data }: Post) => ({
        url: `/${id}`,
        method: "PATCH",
        body: { id, ...data },
      }),
      invalidatesTags: ["Feed"],
    }),
    deletePost: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Token", "Feed"],
    }),
    getAllPosts: builder.query({
      query: (params?: Record<string, any>) => ({
        url: "",
        params,
      }),
      providesTags: ["Post"],
      keepUnusedDataFor: 20,
    }),
    getPost: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, err, id) => [{ type: "Post", id }],
    }),
    getPraise: builder.query({
      query: (params?: Record<string, any>) => ({
        url: "/praises",
        params,
      }),
      providesTags: (result, err, params) => [
        { type: "Post", ...(params || {}) },
      ],
      keepUnusedDataFor: 20,
    }),
    getUserPost: builder.query({
      query: (data?: Record<string, any>) => ({
        url: "/requester",
        params: data,
      }),
      providesTags: (result, err, params) => [
        { type: "Post", ...(params || {}) },
      ],
    }),
    praisePost: builder.mutation({
      query: (id: string) => ({
        url: `/praise/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Post", "Interest"],
    }),
    unpraisePost: builder.mutation({
      query: (id: string) => ({
        url: `/praise/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    getPostFromFollowings: builder.query({
      query: (params?: Record<string, any>) => ({
        url: "/following",
        params,
      }),
      providesTags: ["Following"],
      keepUnusedDataFor: 20,
    }),
    getPostFromInterest: builder.query({
      query: (params?: Record<string, any>) => ({
        url: "/interest",
        params,
      }),
      providesTags: ["Interest"],
      keepUnusedDataFor: 20,
    }),
    getPostsFeed: builder.query({
      query: (params?: Record<string, any>) => ({
        url: "/feed",
        params,
      }),
      providesTags: ["Feed"],
      keepUnusedDataFor: 20,
    }),
    getPostsPopular: builder.query({
      query: (params?: Record<string, any>) => ({
        url: "/popular",
        params,
      }),
      providesTags: ["Popular"],
      keepUnusedDataFor: 20,
    }),
    getBookmarks: builder.query({
      query: () => "/bookmarks",
      providesTags: ["Bookmarks", "Post"],
      keepUnusedDataFor: 20,
    }),
    bookmarkPost: builder.mutation<"Bookmarks", string>({
      query: (id: string) => ({
        url: `/bookmark/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmarks", "Post"],
    }),
    unBookmarkPost: builder.mutation<"Bookmarks", string>({
      query: (id: string) => ({
        url: `/bookmark/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks", "Post"],
    }),
    clickPost: builder.mutation({
      query: (id: string) => ({
        url: `/click/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    viewPost: builder.mutation({
      query: (id: string) => ({
        url: `/view/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    readPost: builder.mutation({
      query: (id: string) => ({
        url: `/read/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    paywallPost: builder.mutation({
      query: (id: string) => ({
        url: `/paywall/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"],
      keepUnusedDataFor: 20,
    }),
    getTopCategories: builder.query({
      query: () => "/top-categories",
      providesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useLazyGetAllPostsQuery,
  useGetBookmarksQuery,
  useLazyGetBookmarksQuery,
  useGetPraiseQuery,
  useLazyGetPraiseQuery,
  useGetPostFromFollowingsQuery,
  useLazyGetPostFromFollowingsQuery,
  useGetPostFromInterestQuery,
  useLazyGetPostFromInterestQuery,
  useGetPostQuery,
  useGetPostsFeedQuery,
  useGetCategoriesQuery,
  useGetTopCategoriesQuery,
  useLazyGetPostsFeedQuery,
  useGetPostsPopularQuery,
  useLazyGetPostsPopularQuery,
  useCreatePostMutation,
  usePraisePostMutation,
  useBookmarkPostMutation,
  useClickPostMutation,
  useDeletePostMutation,
  usePaywallPostMutation,
  useReadPostMutation,
  useViewPostMutation,
  useUpdatePostMutation,
  useUnpraisePostMutation,
  useUnBookmarkPostMutation,
  useGetUserPostQuery,
  useLazyGetUserPostQuery,
} = postApi;
export const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPost,
  getPraise,
  praisePost,
  unpraisePost,
  bookmarkPost,
  unBookmarkPost,
  getBookmarks,
  getPostFromFollowings,
  getPostFromInterest,
  getPostsFeed,
  getPostsPopular,
  viewPost,
  clickPost,
  readPost,
  paywallPost,
} = postApi.endpoints;

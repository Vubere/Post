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
    "Likes",
    "Subscriptions",
    "Bookmarks",
    "Following",
    "Popular",
  ],
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
        body: data,
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
    getAllPosts: builder.query<"Post", any>({
      query: (params?: Record<string, any>) => ({
        url: "",
        params,
      }),
      providesTags: ["Post"],
    }),
    getPost: builder.query<"Post", string>({
      query: (id) => `/${id}`,
      providesTags: (result, err, id) => [{ type: "Post", id }],
    }),
    getLikes: builder.query<"Likes", any>({
      query: () => "/praises",
      providesTags: ["Likes"],
    }),
    getUserPost: builder.query<"User-Post", any>({
      query: () => "/requester",
      providesTags: ["Likes"],
    }),
    praisePost: builder.mutation<"Likes", string>({
      query: (id: string) => ({
        url: `/praise/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Likes", "Interest"],
    }),
    unpraisePost: builder.mutation<"Likes", string>({
      query: (id: string) => ({
        url: `/praise/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Likes"],
    }),
    getPostFromFollowings: builder.query({
      query: () => "/following",
      providesTags: ["Following"],
    }),
    getPostFromInterest: builder.query({
      query: () => "/interest",
      providesTags: ["Interest"],
    }),
    getPostsFeed: builder.query({
      query: () => "/feed",
      providesTags: ["Feed"],
    }),
    getPostsPopular: builder.query({
      query: () => "/popular",
      providesTags: ["Popular"],
    }),
    getBookmarks: builder.query({
      query: () => "/bookmarks",
      providesTags: ["Bookmarks"],
    }),
    bookmarkPost: builder.mutation<"Bookmarks", string>({
      query: (id: string) => ({
        url: `/bookmark/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    unBookmarkPost: builder.mutation<"Bookmarks", string>({
      query: (id: string) => ({
        url: `/bookmark/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks"],
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
        url: `/unsubscribe/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    readPost: builder.mutation({
      query: (id: string) => ({
        url: `/unsubscribe/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    paywallPost: builder.mutation({
      query: (id: string) => ({
        url: `/unsubscribe/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetBookmarksQuery,
  useGetLikesQuery,
  useGetPostFromFollowingsQuery,
  useGetPostFromInterestQuery,
  useGetPostQuery,
  useGetPostsFeedQuery,
  useGetPostsPopularQuery,
  useCreatePostMutation,
  useLikePostMutation,
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
} = postApi;
export const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPost,
  getLikes,
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

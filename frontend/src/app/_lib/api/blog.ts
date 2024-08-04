import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { Post } from "../type";
import { RootState, getState } from "../store";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BASE_URL}/posts`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user?.token;
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
    create: builder.mutation({
      query: (data: Post) => ({
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
    getAllPosts: builder.query({
      query: (params: Record<string, any>) => ({
        url: "",
        params,
      }),
      providesTags: ["Post"],
    }),
    getPost: builder.query<"Post", string>({
      query: (id) => `/${id}`,
      providesTags: (result, err, id) => [{ type: "Post", id }],
    }),
    getLikes: builder.query({
      query: () => "/likes",
      providesTags: ["Likes"],
    }),
    likePost: builder.mutation<"Likes", string>({
      query: (id: string) => ({
        url: `/like/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Likes", "Interest"],
    }),
    unlikePost: builder.mutation<"Likes", string>({
      query: (id: string) => ({
        url: `/like/${id}`,
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
  create,
  updatePost,
  deletePost,
  getAllPosts,
  getPost,
  getLikes,
  likePost,
  unlikePost,
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

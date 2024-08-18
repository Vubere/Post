import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../type";
import { RootState } from "../store";
import axiosBaseQuery from "./axios-config";
import { PayloadAction, Action } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

function isHydrateAction(action: Action): action is PayloadAction<RootState> {
  return action.type === HYDRATE;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
    prepareHeaders: (headers, { getState }) => {
      //@ts-ignore
      const token = (getState() as RootState).user?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "User",
    "Token",
    "Profile",
    "Followers",
    "Following",
    "Blocked",
    "Subscribers",
    "Subscriptions",
  ],
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data: User) => ({
        url: "/sign-up",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Token", "Profile"],
    }),
    login: builder.mutation({
      query: (data: { email: string; password: string }) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Token", "Profile"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }: User) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    updatePrivacySettings: builder.mutation({
      query: (data: {
        messageAccess?: string[];
        notificationAccess?: string[];
      }) => ({
        url: "/update-privacy",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateInterest: builder.mutation({
      query: (data: { interest: string[] }) => ({
        url: "/interest",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateSections: builder.mutation({
      query: (data: { name: string; content: string }[]) => ({
        url: "/sections",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateUserPassword: builder.mutation({
      query: ({
        id,
        ...data
      }: {
        id: string;
        newPassword: string;
        confirmPassword: string;
        password: string;
      }) => ({
        url: `/update-password/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Token", "Profile"],
    }),
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: "/delete",
        method: "DELETE",
      }),
      invalidatesTags: ["Token", "Profile"],
    }),
    getAllUsers: builder.query({
      query: (params: Record<string, any>) => ({
        url: "",
        params,
      }),
      providesTags: ["Users"],
    }),
    getUser: builder.query<"User", string>({
      query: (id) => ({ url: `/${id}` }),
      providesTags: (result, err, id) => [{ type: "User", id }],
    }),
    getUserAnalytics: builder.query<"User", string>({
      query: (id) => ({ url: `/${id}` }),
    }),
    getProfile: builder.query<"Profile", string>({
      query: () => ({ url: `/profile` }),
      providesTags: (result, err, id) => [{ type: "Profile" }],
    }),
    getBlockedUsers: builder.query({
      query: () => ({ url: "/blocked-users" }),
      providesTags: ["Blocked"],
    }),
    blockUser: builder.mutation<"Blocked", string>({
      query: (id: string) => ({
        url: `/block/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Blocked", "Followers", "Subscribers"],
    }),
    unblockUser: builder.mutation<"Blocked", string>({
      query: (id: string) => ({
        url: `/unblock/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Blocked"],
    }),
    getFollowers: builder.query({
      query: () => ({ url: "/followers" }),
      providesTags: ["Followers"],
    }),
    getFollowing: builder.query({
      query: () => ({ url: "/following" }),
      providesTags: ["Following"],
    }),
    followUser: builder.mutation<"Following", string>({
      query: (id: string) => ({
        url: `/follow/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Following"],
    }),
    unfollowUser: builder.mutation<"Profile", string>({
      query: (id: string) => ({
        url: `/unfollow/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Following"],
    }),
    getSubscribers: builder.query({
      query: () => ({ url: "/subscribers" }),
      providesTags: ["Subscribers"],
    }),
    getSubscriptions: builder.query({
      query: () => ({ url: "/subscriptions" }),
      providesTags: ["Subscriptions"],
    }),
    subscribe: builder.mutation<"Subscriptions", string>({
      query: (id: string) => ({
        url: `/subscribe/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    unsubscribe: builder.mutation<"Subscriptions", string>({
      query: (id: string) => ({
        url: `/unsubscribe/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useUpdateInterestMutation,
  useUpdatePrivacySettingsMutation,
  useUpdateSectionsMutation,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useDeleteUserMutation,
  useUnblockUserMutation,
  useUnfollowUserMutation,
  useUnsubscribeMutation,
  useBlockUserMutation,
  useFollowUserMutation,
  useSubscribeMutation,
  useGetSubscribersQuery,
  useGetSubscriptionsQuery,
  useGetUserAnalyticsQuery,
  useGetUserQuery,
  useGetAllUsersQuery,
  useGetBlockedUsersQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useGetProfileQuery,
  util: { getRunningQueriesThunk },
} = userApi;

export const {
  signUp,
  login,
  updateInterest,
  updatePrivacySettings,
  updateSections,
  updateUser,
  updateUserPassword,
  deleteUser,
  unblockUser,
  unfollowUser,
  unsubscribe,
  blockUser,
  followUser,
  subscribe,
  getSubscribers,
  getSubscriptions,
  getUserAnalytics,
  getUser,
  getAllUsers,
  getBlockedUsers,
  getFollowers,
  getFollowing,
  getProfile,
} = userApi.endpoints;

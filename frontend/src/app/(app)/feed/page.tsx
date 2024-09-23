"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import PostDisplay from "@/app/_components/post-display";
import Tab from "@/app/_components/tab";
import { useGetBookmarksQuery, useGetPostFromFollowingsQuery, useGetPostFromInterestQuery, useGetPostsFeedQuery, useGetPostsPopularQuery } from "@/app/_lib/api/post";
import { Post } from "@/app/_lib/type";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";


export default function Bookmarks() {
  const { data, isLoading } = useGetPostsFeedQuery({})
  const { data: popularData, isLoading: popularDataLoading } = useGetPostsPopularQuery({})
  const { data: followingsData, isLoading: followingsDataLoading } = useGetPostFromFollowingsQuery({})
  const { data: interestData, isLoading: interestDataLoading } = useGetPostFromInterestQuery({});

  const bookmarks = data?.data || [];

  return (
    <PageContainer loading={isLoading}>

      <Tab items={[
        {
          title: "Feed",
          content: <></>,
          loading: false
        },
        {
          title: "Following",
          content: <></>,
          loading: false
        },
        {
          title: "Interest",
          content: <></>,
          loading: false
        },
        {
          title: "Top",
          content: <></>,
          loading: false
        },
      ]} loading={isLoading} />
      <div>
        {bookmarks?.map((item: Post) => (
          <PostDisplay isAuthorPost {...item} />
        ))}
      </div>
      {(!bookmarks.length && !isLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}>
          <Empty />
        </div>
        : null
      }
    </PageContainer >
  )
}
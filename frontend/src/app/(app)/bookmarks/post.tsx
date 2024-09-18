"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import PostDisplay from "@/app/_components/post-display";
import { useGetBookmarksQuery } from "@/app/_lib/api/post";
import { Post } from "@/app/_lib/type";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";


export default function Bookmarks() {
  const { data, isLoading } = useGetBookmarksQuery({});
  const bookmarks = data?.data || [];


  return (
    <PageContainer title="Dashboard" loading={isLoading}>
      <div>
        {bookmarks?.map((item: Post) => (
          <PostDisplay isAuthorPost {...item} />
        ))}
      </div>
      {(!bookmarks.length && !isLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}>
          <Empty text="No Bookmarks" />
        </div>
        : null
      }
    </PageContainer >
  )
}
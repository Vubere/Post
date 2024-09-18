"use client";
import PageContainer from "@/app/_components/general/page-container";
import PostDisplay from "@/app/_components/post-display";
import { useGetUserPostQuery } from "@/app/_lib/api/post";
import { Post } from "@/app/_lib/type";
import Empty from "@/app/_components/empty";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";


export default function Drafts() {
  const { data, isLoading } = useGetUserPostQuery({
    status: 0
  });
  ;
  const notifications = data?.data || [];


  return (
    <PageContainer title="Notifications" loading={isLoading}>
      <div>
        {notifications?.map((item: Post) => (
          <PostDisplay isAuthorPost {...item} />
        ))}
      </div>
      {(!notifications.length && !isLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}>
          <Empty text="No Notifications" />
        </div>
        : null
      }
    </PageContainer >
  )
}
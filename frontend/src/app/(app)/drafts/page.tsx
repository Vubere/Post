"use client";
import PageContainer from "@/app/_components/general/page-container";
import PostDisplay from "@/app/_components/post-display";
import { useGetUserPostQuery, useLazyGetUserPostQuery } from "@/app/_lib/api/post";
import { Post } from "@/app/_lib/type";
import Empty from "@/app/_components/empty";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";
import InfiniteScroll from "@/app/_components/infinite-scroll";
import { loadMoreItems } from "@/app/_lib/services";


export default function Drafts() {
  const { data, isLoading } = useGetUserPostQuery({
    status: 0
  });
  const [getUserPost, { isLoading: isFetching }] = useLazyGetUserPostQuery();
  const drafts = data?.data || [];

  return (
    <PageContainer title="Drafts" loading={isLoading}>
      {drafts.length > 0 &&
        <InfiniteScroll
          limit={10}
          className="!gap-1"
          isLoading={isLoading || isFetching}
          error={false}
          storageKey={"drafts"}
          loadMore={(page) => loadMoreItems(page, getUserPost, 10, { status: 0 })}
          initialData={drafts}
          hasMore={data?.count < 10}
          Element={PostDisplay}
        />
      }
      {(!drafts.length && !isLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}>
          <Empty />
        </div>
        : null
      }
    </PageContainer >
  )
}
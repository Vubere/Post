"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import InfiniteScroll from "@/app/_components/infinite-scroll";
import PostDisplay from "@/app/_components/post-display";
import { useGetBookmarksQuery, useLazyGetBookmarksQuery } from "@/app/_lib/api/post";
import { loadMoreItems } from "@/app/_lib/services";
import { Post } from "@/app/_lib/type";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";


export default function Bookmarks() {
  const { data, isLoading } = useGetBookmarksQuery({});
  const [getBookmarks, { isLoading: isFetchingBookmarks }] = useLazyGetBookmarksQuery();
  const bookmarks = data?.data || [];

  return (
    <PageContainer title="Bookmarks" loading={isLoading}>
      {bookmarks.length > 0 &&
        <InfiniteScroll
          limit={10}
          isLoading={isLoading || isFetchingBookmarks}
          error={false}
          storageKey={"feed"}
          loadMore={(page) => loadMoreItems(page, getBookmarks)}
          initialData={bookmarks}
          hasMore={data?.count < 10}
          Element={PostDisplay}
        />
      }
      {(!bookmarks.length && !isLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}>
          <Empty text="No Bookmarks" />
        </div>
        : null
      }
    </PageContainer >
  )
}
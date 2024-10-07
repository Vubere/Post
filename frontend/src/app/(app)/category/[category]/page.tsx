"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import InfiniteScroll from "@/app/_components/infinite-scroll";
import PostDisplay from "@/app/_components/post-display";
import Tab from "@/app/_components/tab";
import { useGetAllPostsQuery, useLazyGetAllPostsQuery, } from "@/app/_lib/api/post";
import { loadMoreItems } from "@/app/_lib/services";
import { Post } from "@/app/_lib/type";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";
import { startCase } from "lodash";
import { usePathname } from "next/navigation";


export default function Feed() {
  const categories = usePathname().split("/")[2];
  const { data, isLoading, isFetching, refetch } = useGetAllPostsQuery({
    page: 1,
    limit: 10,
    categories
  });
  const [getPost, { isLoading: isLoadingPost, isFetching: isFetchingPost }] = useLazyGetAllPostsQuery();

  const post = data?.data || [];
  const getMorePost = async (params?: Record<string, any>) => {
    return (await getPost({
      categories,
      ...params
    }))
  }

  return (
    <PageContainer title={`Posts in category "${startCase(categories)}"`}>
      <InfiniteScroll
        limit={10}
        isLoading={isLoading || isFetching || isFetchingPost || isLoadingPost}
        error={false}
        storageKey={"post"}
        loadMore={(page) => loadMoreItems(page, getMorePost)}
        initialData={post}
        hasMore={post?.length === 10}
        Element={PostDisplay}
        componentExtraProps={{ validate: refetch }}
      />
      {(!post.length && !isLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}>
          <Empty />
        </div>
        : null
      }
    </PageContainer >
  )
}
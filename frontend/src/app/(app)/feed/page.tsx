"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import InfiniteScroll from "@/app/_components/infinite-scroll";
import PostDisplay from "@/app/_components/post-display";
import Tab from "@/app/_components/tab";
import { useGetPostFromFollowingsQuery, useGetPostFromInterestQuery, useGetPostsFeedQuery, useGetPostsPopularQuery, useLazyGetPostFromFollowingsQuery, useLazyGetPostFromInterestQuery, useLazyGetPostsFeedQuery, useLazyGetPostsPopularQuery } from "@/app/_lib/api/post";
import { loadMoreItems } from "@/app/_lib/services";
import { Post } from "@/app/_lib/type";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";
import { ref } from "yup";


export default function Feed() {
  const { data, isLoading, refetch } = useGetPostsFeedQuery({
    page: 1,
    limit: 10
  });
  const { data: popularData, isLoading: popularDataLoading, refetch: refetchPopular } = useGetPostsPopularQuery({});
  const { data: followingsData, isLoading: followingsDataLoading, refetch: refetchFollowings } = useGetPostFromFollowingsQuery({})


  const feed = data?.data || [];
  const popular = popularData?.data || [];
  const following = followingsData?.data || [];

  return (
    <div className="text-black pt-[40px] pb-[60px]">
      <Tab items={[
        {
          title: "Feed",
          content: (
            <FeedData initialDataLoading={isLoading} initialData={feed} refetch={refetch} />
          ),
          loading: isLoading
        },
        {
          title: "Following",
          content: (
            <FollowingData initialDataLoading={followingsDataLoading} initialData={following} refetch={refetchFollowings} />
          ),
          loading: followingsDataLoading
        },
        {
          title: "Top",
          content: (
            <PopularData initialDataLoading={popularDataLoading} initialData={popular} refetch={refetchPopular} />
          ),
          loading: popularDataLoading
        },
      ]} loading={isLoading} />

    </div>
  )
}

function FeedData({ initialData, initialDataLoading, refetch }: { initialData: any[], initialDataLoading: boolean, refetch: () => any }) {
  const [getPostsFeed, { isLoading: isLoadingFeed, isFetching: isFetchingFeed }] = useLazyGetPostsFeedQuery();
  const feedLoading = isLoadingFeed || isFetchingFeed || initialDataLoading;
  return (
    <>
      {
        initialData.length > 0 && <InfiniteScroll
          limit={10}
          isLoading={feedLoading}
          className="!gap-1"
          error={false}
          storageKey={"feed"}
          loadMore={(page) => loadMoreItems(page, getPostsFeed)}
          initialData={initialData}
          hasMore={initialData?.length === 10}
          Element={PostDisplay}
          componentExtraProps={{ validate: refetch }}
        />}

      {(!initialData.length && !initialDataLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}>
          <Empty />
        </div>
        : null
      }
    </>
  )
}

function PopularData({ initialData, initialDataLoading, refetch }: { initialData: any[], initialDataLoading: boolean, refetch: () => any }) {
  const [getPostPopular, { isLoading: isLoadingPopular, isFetching: isFetchingPopular }] = useLazyGetPostsPopularQuery();
  const popularLoading = isLoadingPopular || isFetchingPopular || initialDataLoading;
  return (
    <>
      {
        initialData.length > 0 && <InfiniteScroll
          isLoading={popularLoading}
          error={false}
          storageKey={"initialData"}
          loadMore={(page) => loadMoreItems(page, getPostPopular)}
          initialData={initialData}
          hasMore={initialData?.length === 10}
          Element={PostDisplay}
          componentExtraProps={{ validate: refetch }}
        />}
      {(!initialData.length && !initialDataLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}> <Empty /></div>
        : null}
    </>
  )
}

function FollowingData({ initialData, initialDataLoading, refetch }: { initialData: any[], initialDataLoading: boolean, refetch: () => any }) {
  const [getPostsFollowing, { isLoading: isLoadingFollowing, isFetching: isFetchingFollowing }] = useLazyGetPostFromFollowingsQuery();
  const followingLoading = isLoadingFollowing || isFetchingFollowing;

  return (
    <>
      {
        initialData.length > 0 && <InfiniteScroll
          limit={10}
          isLoading={followingLoading}
          error={false}
          storageKey={"following"}
          loadMore={(page) => loadMoreItems(page, getPostsFollowing)}
          initialData={initialData}
          hasMore={initialData?.length === 10}
          Element={PostDisplay}
          componentExtraProps={{ validate: refetch }}
        />}

      {(!initialData.length && !initialDataLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}>
          <Empty />
        </div>
        : null
      }
    </>
  )
}

"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import InfiniteScroll from "@/app/_components/infinite-scroll";
import PostDisplay from "@/app/_components/post-display";
import Tab from "@/app/_components/tab";
import { useGetBookmarksQuery, useGetPostFromFollowingsQuery, useGetPostFromInterestQuery, useGetPostsFeedQuery, useGetPostsPopularQuery, useLazyGetPostFromFollowingsQuery, useLazyGetPostFromInterestQuery, useLazyGetPostsFeedQuery, useLazyGetPostsPopularQuery } from "@/app/_lib/api/post";
import { loadMoreItems } from "@/app/_lib/services";
import { Post } from "@/app/_lib/type";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";


export default function Feed() {
  const { data, isLoading, isFetching, refetch } = useGetPostsFeedQuery({
    page: 1,
    limit: 10
  });
  const [getPostsFeed, { isLoading: isFetchingFeed }] = useLazyGetPostsFeedQuery();
  const { data: popularData, isLoading: popularDataLoading } = useGetPostsPopularQuery({});
  const [getPostPopular, { isLoading: isFetchingPopular }] = useLazyGetPostsPopularQuery();
  const { data: followingsData, isLoading: followingsDataLoading } = useGetPostFromFollowingsQuery({})
  const [getPostsFollowing, { isLoading: isFetchingFollowing }] = useLazyGetPostFromFollowingsQuery();
  // const { data: interestData, isLoading: interestDataLoading } = useGetPostFromInterestQuery({});
  // const [getPostInterest, { isLoading: isFetchingInterest }] = useLazyGetPostFromInterestQuery();

  const feed = data?.data || [];
  const popular = popularData?.data || [];
  const following = followingsData?.data || [];
  // const interest = interestData?.data || [];

  return (
    <PageContainer>
      <Tab items={[
        {
          title: "Feed",
          content: (
            <>

              {feed.length > 0 && <InfiniteScroll
                limit={10}
                isLoading={isLoading || isFetchingFeed}
                error={false}
                storageKey={"feed"}
                loadMore={(page) => loadMoreItems(page, getPostsFeed)}
                initialData={feed}
                hasMore={data?.count < 10}
                Element={PostDisplay}
              />}

              {(!feed.length && !isLoading) ?
                <div className={"w-full" + SECTION_CLASSNAME}>
                  <Empty />
                </div>
                : null
              }
            </>
          ),
          loading: isLoading
        },
        {
          title: "Following",
          content: (
            <>

              {following.length > 0 && <InfiniteScroll
                limit={10}
                isLoading={followingsDataLoading || isFetchingFollowing}
                error={false}
                storageKey={"following"}
                loadMore={(page) => loadMoreItems(page, getPostsFollowing)}
                initialData={following}
                hasMore={data?.count < 10}
                Element={PostDisplay}
              />}

              {(!following.length && !isLoading) ?
                <div className={"w-full" + SECTION_CLASSNAME}>
                  <Empty />
                </div>
                : null
              }
            </>
          ),
          loading: followingsDataLoading
        },
        // {
        //   title: "Interest",
        //   content: (
        //     <>
        //       {interest.length > 0 && <InfiniteScroll
        //         isLoading={interestDataLoading || isFetchingInterest}
        //         error={false}
        //         storageKey={"interest"}
        //         loadMore={(page) => loadMoreItems(page, getPostInterest)}
        //         initialData={interest}
        //         hasMore={data?.count < 10}
        //         Element={PostDisplay}
        //       />}
        //       {(!interest.length && !isLoading) ?
        //         <div className={"w-full" + SECTION_CLASSNAME}> <Empty /></div>
        //         : null}
        //     </>
        //   ),
        //   loading: interestDataLoading
        // },
        {
          title: "Top",
          content: (
            <>{popular.length > 0 && <InfiniteScroll
              isLoading={popularDataLoading || isFetchingPopular}
              error={false}
              storageKey={"popular"}
              loadMore={(page) => loadMoreItems(page, getPostPopular)}
              initialData={popular}
              hasMore={data?.count < 10}
              Element={PostDisplay}
            />}
              {(!popular.length && !isLoading) ?
                <div className={"w-full" + SECTION_CLASSNAME}> <Empty /></div>
                : null}
            </>
          ),
          loading: popularDataLoading
        },
      ]} loading={isLoading} />

    </PageContainer >
  )
}
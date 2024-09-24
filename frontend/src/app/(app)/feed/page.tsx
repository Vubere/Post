"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import PostDisplay from "@/app/_components/post-display";
import Tab from "@/app/_components/tab";
import { useGetBookmarksQuery, useGetPostFromFollowingsQuery, useGetPostFromInterestQuery, useGetPostsFeedQuery, useGetPostsPopularQuery } from "@/app/_lib/api/post";
import { Post } from "@/app/_lib/type";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";


export default function Feed() {
  const { data, isLoading } = useGetPostsFeedQuery({})
  const { data: popularData, isLoading: popularDataLoading } = useGetPostsPopularQuery({})
  const { data: followingsData, isLoading: followingsDataLoading } = useGetPostFromFollowingsQuery({})
  const { data: interestData, isLoading: interestDataLoading } = useGetPostFromInterestQuery({});

  const feed = data?.data || [];
  const popular = popularData?.data || [];
  const following = followingsData?.data || [];
  const interest = interestData?.data || [];

  return (
    <PageContainer>
      <Tab items={[
        {
          title: "Feed",
          content: (
            <>
              <div>
                {feed?.map((item: Post) => (
                  <PostDisplay isAuthorPost {...item} />
                ))}
              </div>
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
              <div>
                {following?.map((item: Post) => (
                  <PostDisplay isAuthorPost {...item} />
                ))}
              </div>
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
        {
          title: "Interest",
          content: (
            <>
              <div>
                {interest?.map((item: Post) => (
                  <PostDisplay isAuthorPost {...item} />
                ))}
              </div>
              {(!interest.length && !isLoading) ?
                <div className={"w-full" + SECTION_CLASSNAME}>
                  <Empty />
                </div>
                : null
              }
            </>
          ),
          loading: interestDataLoading
        },
        {
          title: "Top",
          content: (
            <>
              <div>
                {popular?.map((item: Post) => (
                  <PostDisplay isAuthorPost {...item} />
                ))}
              </div>
              {(!popular.length && !isLoading) ?
                <div className={"w-full" + SECTION_CLASSNAME}>
                  <Empty />
                </div>
                : null
              }
            </>
          ),
          loading: popularDataLoading
        },
      ]} loading={isLoading} />

    </PageContainer >
  )
}
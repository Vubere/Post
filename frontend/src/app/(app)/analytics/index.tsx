"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { Post } from "@/app/_lib/type";
import { useGetUserAnalyticsQuery } from "@/app/_lib/api/user";
import PostDisplay from "@/app/_components/post-display";
import { useGetTopPostQuery } from "@/app/_lib/api/open";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";
import { startCase } from "lodash";
import { useMemo } from "react";




export default function Analytics() {
  const { info } = useAppSelector(state => state.user);
  const { data, isLoading } = useGetUserAnalyticsQuery("");
  const { data: topPostData } = useGetTopPostQuery({
    author: info?._id || info?.id,
    limit: 3,
    showPaywall: true
  });
  console.log(topPostData)
  const userAnalytics = data?.data?.userInteractionAnalytics || {};
  const topPost: Post[] = topPostData?.data || [];
  const userAnalyticsArray = useMemo(() => Object.entries(userAnalytics).filter(v => typeof v[1] === "number"), [userAnalytics]) as unknown as [string, number][];
  const postAnalytics = data?.data?.userPostAnalytics || {};
  const postAnalyticsArray = useMemo(() => Object.entries(postAnalytics).filter(v => typeof v[1] === "number"), [postAnalytics]) as unknown as [string, number][];



  return (
    <PageContainer title="Analytics" loading={isLoading}>

      <section className={SECTION_CLASSNAME + "mb-4"}>
        <h3 className="font-bold text-[16px] xs:text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px]">User Interactions</h3>
        <div>
          <ul>
            {
              userAnalyticsArray.map(([name, value]: [string, number]) => (
                <li key={name} className="font-medium  text-[#34343499] ">{startCase(name.replace("Count", ""))} : {value}</li>
              ))
            }

          </ul>
        </div>
      </section>
      <section className={SECTION_CLASSNAME}>
        <h3 className="font-bold text-[16px] xs:text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px]">Post Interactions</h3>
        <div>
          {postAnalyticsArray.length ? (<ul>
            {
              postAnalyticsArray.map(([name, value]: [string, number]) => (
                <li key={name} className="font-medium  text-[#34343499] ">{startCase(name.replace("Count", ""))} : {value}</li>
              ))
            }

          </ul>) :
            <Empty text="You have no Post to Analyse" />
          }
        </div>
      </section>
      <section className="bg-white w-full p-4 text-black mb-[40px]">
        <h3 id="top-post" className="w-full font-bold text-[24px] md:text-[28px] lg:text-[32px]">Top Posts</h3>
        <ul className="flex overflow-y-hidden overflow-x-auto gap-[10px] sm:gap-[20px] py-4">
          {
            topPost.map((item, i) => {
              const synopsisTruncate = item.synopsis !== undefined && item.synopsis.length > 100 ? item.synopsis.slice(0, 97) + "..." : item.synopsis;
              return (
                <div className="flex items-center justify-center">

                  <PostDisplay key={i} className="max-w-[90vw] w-[280px] nxs:min-w-[250px] min-w-[280px]  sm:w-[320px] sm:min-w-[320px] md:w-[360px] md:min-w-[360px]" {...item} synopsis={synopsisTruncate} />
                </div>
              )
            })
          }

        </ul>
      </section>
    </PageContainer>
  )
}
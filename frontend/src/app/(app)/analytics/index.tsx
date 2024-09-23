"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import { useGetUserAnalyticsQuery } from "@/app/_lib/api/user";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";
import { startCase } from "lodash";
import { useMemo } from "react";




export default function Analytics() {
  const { data, isLoading } = useGetUserAnalyticsQuery("");
  const userAnalytics = data?.data?.userInteractionAnalytics || {};
  const userAnalyticsArray = useMemo(() => Object.entries(userAnalytics).filter(v => typeof v[1] === "number"), [userAnalytics]) as unknown as [string, number][];
  const postAnalytics = data?.data?.userPostAnalytics || {};
  const postAnalyticsArray = useMemo(() => Object.entries(postAnalytics).filter(v => typeof v[1] === "number"), [postAnalytics]) as unknown as [string, number][];



  return (
    <PageContainer title="Analytics" loading={isLoading}>
      <section className={SECTION_CLASSNAME + "mb-4"}>
        <h3 className="font-bold text-[16px] xs:text-[18px] sm:text-[21px] md:text-[24px] lg:text-[28px]">User Interactions</h3>
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
        <h3 className="font-bold text-[16px] xs:text-[18px] sm:text-[21px] md:text-[24px] lg:text-[28px]">Post Interactions</h3>
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
    </PageContainer>
  )
}
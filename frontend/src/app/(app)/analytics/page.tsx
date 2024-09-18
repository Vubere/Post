"use client";
import PageContainer from "@/app/_components/general/page-container";
import { useGetUserAnalyticsQuery } from "@/app/_lib/api/user";


export default function Analytics() {
  const { data, isLoading } = useGetUserAnalyticsQuery("");
  const analyticsUser = data?.data?.userInteractionAnalytics;
  const analyticsPost = data?.data?.userPostAnalytics;
  console.log(analyticsUser, analyticsPost);

  return (
    <PageContainer title="Analytics" loading={isLoading}>
      <div>

      </div>
    </PageContainer>
  )
}
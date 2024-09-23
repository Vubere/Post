import { Metadata } from "next"
import AnalyticsPage from "."

export const metadata: Metadata = {
  title: "Analytics",
  description: "Analytics -- see how you have interacted with the community and how it has interacted with you!"
}


export default function Analytics() {

  return (
    <AnalyticsPage />
  )
}
"use client";
import { useGetAllPostsQuery } from "@/app/_lib/api/post";
import Feeds from "./post";


export default function Dashboard() {
  /*  const data = useGetAllPostsQuery();
   console.log(data) */
  return (
    <div>
      <Feeds />
      <h1 className="text-black">Dashboard</h1>
    </div>
  )
}
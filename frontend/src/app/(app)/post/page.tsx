import { redirect } from "next/navigation";



export const metadata = {
  title: "Collections",
  description: "Collections"
}

export default async function Post() {
  redirect("/dashboard")
}
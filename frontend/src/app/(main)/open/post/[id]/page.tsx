import PageContainer from "@/app/_components/general/page-container";
import PostComments from "@/app/_components/post-comments";
import PostReactions from "@/app/_components/post-display/post-reactions";
import PostPage from "@/app/_components/post-page";
import { cookies } from "next/headers";


type Params = {
  id: string
}
interface EditPost {
  params: Params
}
export const revalidate = 1;
async function getPost(id: string) {
  try {
    if (id) {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/open/posts/${id}`).then(res => res.json());
      if (res?.data) {
        return { data: res?.data, status: "success" };
      }
      throw new Error("failed to fetch post");
    }
    return { status: "failed" };
  } catch (error) {
    return ({
      error,
      status: "failed",
    });
  }
}


export async function generateMetadata({ params: { id } }: EditPost) {
  const post = await getPost(id);
  const title = post?.data?.title
  return {
    title: title ? title : "Post",
    description: post?.data?.synopsis || `Post: ${title || ""}!`
  }
}


export default async function Post({ params: { id } }: EditPost) {
  const postData = await getPost(id);
  const post = postData?.data;
  if (postData?.status === "failed") {
    return <div>Error fetching post, reload page!</div>
  }
  return (
    <div className="text-black pb-10">
      <div className="h-[80px] min-h-[80px] px-2 sm:px-4 md:px-6 lg:px-8  mx-auto bg-[#334433]">
      </div>

      <div className="pt-[80px] px-2 sm:px-4 md:px-6 lg:px-8 max-w-[700px] mx-auto">
        <PostPage post={post} disabled />
        {/* reaction */}

        {/* comments */}
      </div>
    </div>
  );
}

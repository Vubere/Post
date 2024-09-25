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
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (id && token) {

      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/posts/${id}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      }).then(res => res.json());
      return { data: res?.data, status: "success" };
    } else {
      return ({
        message: "no token or post id sent",
        status: "failed",
      });
    }
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
    <PageContainer>
      <div className="pt-4 px-2 sm:px-4 md:px-6 lg:px-8 max-w-[700px] mx-auto">
        <PostPage {...post} />
        {/* reaction */}
        <div className="mt-8">
          <PostReactions showReads showViews isPostPage {...post} />
        </div>
        {/* comments */}
        <PostComments {...post} />
      </div>
    </PageContainer>
  );
}
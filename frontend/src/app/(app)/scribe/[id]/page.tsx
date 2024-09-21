import PostEditor from "@/app/_components/post-editor";
import { cookies } from "next/headers";


type Params = {
  id: string
}
interface EditPost {
  params: Params
}
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
    title: title ? "Edit Post : " + title : "Edit Post",
    description: `Edit your post: ${title || ""}!`
  }
}


export default async function EditPost({ params: { id } }: EditPost) {
  const postData = await getPost(id);
  const post = postData?.data;
  if (postData?.status === "failed") {

    return <div>Error fetching post, reload page!</div>
  }

  return (
    <PostEditor editorTitle={"Edit Post : " + post.title} {...(post || {})} />
  );
}
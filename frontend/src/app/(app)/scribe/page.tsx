import PostEditor from "@/app/_components/post-editor";


export async function generateMetadata() {
  return {
    title: "Scribe Post",
    description: "Compose your next post!"
  }
}

export default function CreatePost() {

  return (
    <PostEditor />
  );
}
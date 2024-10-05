"use client";
import Button from "@/app/_components/general/button";
import Editor from "@/app/_components/post-editor/editor";
import { useEffect, useState } from "react";
import PostOptions from "./post-options";
import { toast } from "react-toastify";
import { isEmpty } from "lodash";
import { Post } from "@/app/_lib/type";

interface PostEditor extends Partial<Post> {
  className?: string,
  editorTitle?: string
}

export default function PostEditor({ className, editorTitle, ...post }: PostEditor) {
  const { content: postContent, title: postTitle, synopsis: postSynopsis, theme: postTheme, coverPhoto: postCoverPhoto } = post;
  const [open, setOpen] = useState(false);

  const [content, setContent] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<any>("");


  const onCancel = () => {
    setOpen(false);
  }
  const onDone = () => {
    if (content.length < 1 || title.length < 1) {
      toast.error("you post should at least contain a title and a post content!");
      return;
    }
    setOpen(true);
  }
  const resetDetails = () => {
    setContent("");
    setCoverPhoto("");
    setTitle("");
    setSynopsis("");
    setOpen(false);
  }
  const postDetails = {
    content,
    coverPhoto,
    title,
    synopsis,
    theme
  }
  useEffect(() => {
    if (post && !isEmpty(post)) {
      setContent((postContent || "").replace(/&lt;/g, "<"));
      setCoverPhoto(postCoverPhoto || "");
      setTitle(postTitle || "");
      setSynopsis(postSynopsis || "");
      setTheme(postTheme || "");
    }
  }, [])

  return (
    <div className={"text-black px-4 pb-[60px] " + className}>
      <h1 className="font-bold text-[16px] xs:text-[18px] sm:text-[21px] md:text-[24px] mb-8">{editorTitle ?? "Create Post"}</h1>
      <PostOptions open={open} onCancel={onCancel} postDetails={postDetails} resetDetails={resetDetails} post={post} />
      <div className="">

        <Editor theme={theme} setTheme={setTheme} post={content} postOnChange={setContent} heading={title} headerOnChange={setTitle} coverLink={coverPhoto} coverLinkOnChange={setCoverPhoto} synopsis={synopsis} synopsisOnChange={setSynopsis} />
        <div className="flex justify-end mt-[40px]">
          <Button className="!w-[100px]" text="Done" onClick={onDone} />
        </div>
      </div>
    </div>
  );
}
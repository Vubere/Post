"use client";
import Button from "@/app/_components/general/button";
import Editor from "@/app/_components/post-editor";
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import PostOptions from "./components/post-options";
import { toast } from "react-toastify";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("");

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

  return (
    <div className="text-black px-4 pb-[60px]">
      <h1 className="font-bold text-[16px] xs:text-[18px] sm:text-[21px] md:text-[24px] mb-8">Create Post</h1>
      <PostOptions open={open} onCancel={onCancel} postDetails={postDetails} resetDetails={resetDetails} />
      <div className="">

        <Editor theme={theme} setTheme={setTheme} post={content} postOnChange={setContent} heading={title} headerOnChange={setTitle} coverLink={coverPhoto} coverLinkOnChange={setCoverPhoto} synopsis={synopsis} synopsisOnChange={setSynopsis} />
        <div className="flex justify-end mt-[40px]">
          <Button className="!w-[100px]" text="Done" onClick={onDone} />
        </div>
      </div>
    </div>
  );
}
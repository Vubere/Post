"use client";
import Editor from "@/app/_components/post-editor";
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  const [value, setValue] = useState("");
  const [coverLink, setCoverLink] = useState("");
  const [heading, setHeading] = useState("");
  const [synopsis, setSynopsis] = useState("");

  return (
    <div className="text-black px-4">
      <div className="">
        <Editor post={value} postOnChange={setValue} heading={heading} headerOnChange={setHeading} coverLink={coverLink} coverLinkOnChange={setCoverLink} synopsis={synopsis} synopsisOnChange={setSynopsis} />
      </div>
    </div>
  );
}
"use client";

import { useReadPostMutation } from "@/app/_lib/api/post";
import InView from "../in-view";
import { useState } from "react";


const ReadDetect = ({ reads, id, disabled }: { reads: string[], id: string, disabled?: boolean }) => {
  const [readPost] = useReadPostMutation();
  const [read, setRead] = useState(false);

  if (disabled) return null;
  const action = () => {
    if (!read) {
      readPost(id);
      setRead(true)
    }
  };

  return (
    <InView action={action} />
  )
}

export default ReadDetect;

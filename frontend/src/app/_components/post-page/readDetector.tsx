"use client";

import { useReadPostMutation } from "@/app/_lib/api/post";
import { useEffect, useRef, useState } from "react";


const ReadDetect = ({ reads, id }: { reads: string[], id: string }) => {
  const readIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [readPost] = useReadPostMutation();
  const [read, setRead] = useState(false);

  useEffect(() => {
    const postContainer = readIndicatorRef.current;
    if (postContainer && !read) {
      const observer = new IntersectionObserver(([entry]) => {
        const viewed = reads?.includes(id);
        if (!viewed) {
          readPost(id);
          setRead(true)
        }
      });
      observer.observe(postContainer);
      return () => {
        observer.disconnect();
      };
    }
  }, [readIndicatorRef, read]);

  return (
    <div ref={readIndicatorRef} />
  )
}

export default ReadDetect;

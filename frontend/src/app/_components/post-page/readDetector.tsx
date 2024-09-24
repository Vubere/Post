"use client";

import { useReadPostMutation } from "@/app/_lib/api/post";
import { MutableRefObject, useEffect, useRef } from "react";


const ReadDetect = ({ reads, id }: { reads: string[], id: string }) => {
  const readIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [readPost] = useReadPostMutation();

  useEffect(() => {
    const postContainer = readIndicatorRef.current;
    if (postContainer) {
      const observer = new IntersectionObserver(([entry]) => {
        const viewed = reads?.includes(id);
        if (!viewed) {
          readPost(id);
        }
      });
      observer.observe(postContainer);
      return () => {
        observer.disconnect();
      };
    }
  }, [readIndicatorRef]);

  return (
    <div ref={readIndicatorRef} />
  )
}

export default ReadDetect;

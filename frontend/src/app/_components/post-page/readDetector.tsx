"use client";

import { useReadPostMutation } from "@/app/_lib/api/post";
import { useEffect, useRef } from "react";


const ReadDetect = ({ reads, id }: { reads: string[], id: string }) => {
  const readIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [readPost] = useReadPostMutation();

  useEffect(() => {
    const readIndicator = readIndicatorRef.current;
    if (readIndicator) {
      const scrolledIntoView = function () {
        const position = readIndicator.getBoundingClientRect();
        if (position.top >= 0 && position.bottom <= window.innerHeight) {
          const read = reads?.includes(id || "");
          if (!read) {
            readPost(id);
          }
        }
      }
      window.addEventListener('scroll', scrolledIntoView);
      return () => window.removeEventListener('scroll', scrolledIntoView);
    }
  }, [readIndicatorRef.current]);

  return (
    <div ref={readIndicatorRef} />
  )
}

export default ReadDetect;

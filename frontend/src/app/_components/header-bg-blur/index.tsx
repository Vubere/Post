"use client";

import { useEffect, useState } from "react";


export default function HeaderBgBlur() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window) {
      const eventList = () => {
        const scrollTop = window.pageYOffset;
        if (scrollTop > 400) {
          setShow(true);
        } else {
          setShow(false);
        }
      }
      window.addEventListener("scroll", eventList);
      return () => {
        window.removeEventListener("scroll", eventList);
      };
    }
  }, [])

  if (!show) return null;
  return (
    <div className="absolute top-0 left-0 w-full h-[70px] md:h-[80px] bg-[#0004] blur-[10px] z-[6]"></div>
  )
}
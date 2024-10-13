"use client";

import { useEffect, useState } from "react";

export default function HeaderBgBlur() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      console.log(scrollTop);
      if (scrollTop > 400) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    let ticking = false;
    const optimizedHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", optimizedHandleScroll);

    return () => {
      window.removeEventListener("scroll", optimizedHandleScroll);
    };
  }, []);

  if (!show) return null;
  console.log(show)
  return (
    <div className="fixed top-0 left-0 w-full min-h-[70px] h-[70px] sm:h-[80px] sm:min-h-[80px] bg-[#0009] blur-[10px] z-[4]"></div>
  );
}

"use client";

import { ROUTES } from "@/app/_lib/routes";
import Link from "next/link";
import { useRef, useEffect } from "react";



export default function MobileHeader() {
  const menuRef = useRef<HTMLUListElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const hamburgerShowRef = useRef<HTMLDivElement>(null);
  const hamburgerHidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menuElement = menuRef.current;
    const hamburgerElement = hamburgerRef.current;

    const toggleView = () => {
      if (menuElement) {
        const close = menuElement.classList.contains("hidden");
        if (close) {
          menuElement.classList.remove("hidden");
          if (hamburgerHidRef.current && hamburgerShowRef.current) {
            hamburgerHidRef.current.classList.remove("hidden");
            hamburgerShowRef.current.classList.add("hidden");
          }
        } else {
          menuElement.classList.add("hidden");
          if (hamburgerHidRef.current && hamburgerShowRef.current) {
            hamburgerHidRef.current.classList.add("hidden");
            hamburgerShowRef.current.classList.remove("hidden");
          }
        }
      }
    }
    const closeOnOutsideClick = (e: MouseEvent) => {
      const clickedElement = e.target as HTMLElement;
      if (clickedElement && menuElement) {
        if (!(menuElement.contains(clickedElement) || clickedElement.classList.contains("8ruewf0haf_1!"))) {
          if (clickedElement.attributes.getNamedItem("data-menu-button")) {
            return;
          }
          menuElement.classList.add("hidden");
          if (hamburgerHidRef.current && hamburgerShowRef.current) {
            hamburgerHidRef.current.classList.add("hidden");
            hamburgerShowRef.current.classList.remove("hidden");
          }
        }
      }
    }
    if (hamburgerElement) {
      hamburgerElement.addEventListener("click", toggleView);
      window.addEventListener("click", closeOnOutsideClick)
      return () => {
        hamburgerElement.removeEventListener("click", toggleView);
        window.removeEventListener("click", closeOnOutsideClick);
      };
    }
  }, [menuRef.current, hamburgerRef.current])

  return (
    <header className="flex pt-[13px] py-[20px] px-[20px] h-[90px] justify-between items-center fixed top-0 left-0 w-full  z-[5] sm:hidden">
      <h1 className="font-bold italic text-[21px] ">Collections</h1>
      <button ref={hamburgerRef} className="relative z-[4] " data-menu-button>
        <div className="flex flex-col bg:transparent justify-between w-[40px] h-[16px] [&_span]:h-[3px] [&_span]:w-full [&_span]:bg-white [&:span]:block [&_span]:rounded-full " data-menu-button ref={hamburgerShowRef}>
          <span id="h-top" data-menu-button></span>
          <span id="h-bottom" data-menu-button></span>
        </div>
        <div className="flex flex-col bg:transparent justify-between w-[40px] h-[6px] [&_span]:h-[3px] [&_span]:w-[60%] [&_span]:bg-white [&:span]:block [&_span]:rounded-full [&_span]:absolute [&_#h-top]:top-1/2 [&_#h-bottom]:top-1/2 [&_#h-top]:-rotate-45 [&_#h-bottom]:rotate-45 hidden" data-menu-button ref={hamburgerHidRef}>
          <span id="h-top" data-menu-button></span>
          <span id="h-bottom" data-menu-button></span>
        </div>
      </button>
      <ul className="flex flex-col p-[20px] gap-[25px] fixed top-0 pt-[140px] flex w-[70%] min-w-[280px] bg-[#0007]  right-0 h-screen z-[3] backdrop-blur-[6px] hidden 8ruewf0haf_1!" ref={menuRef}>
        <div className="absolute min-w-full min-h-full left-0 top-0 blur-[4px]"></div>

        <li><Link href={ROUTES.about} className="cursor-pointer block w-full text-center hover:underline font-medium">About</Link></li>
        <div className="flex flex-col gap-[10px]">
          <span className="flex  bg-[#fff]  justify-center items-center rounded-full cursor-pointer relative ">
            <li><Link href={ROUTES.signup} className="block min-h-full text-black font-medium w-full max-w-[100px]  rounded-full px-2 py-2 ">Sign Up</Link></li>
          </span>
          <span className="flex  bg-[#fff2]  justify-center items-center rounded-full cursor-pointer relative ">
            <li><Link href={ROUTES.login} className="block min-h-full w-full max-w-[100px] font-medium  rounded-full px-2 py-2 ">Login</Link></li>
          </span>
        </div>
      </ul>
    </header>
  )
}
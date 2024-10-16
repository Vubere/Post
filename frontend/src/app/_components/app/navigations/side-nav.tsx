"use client"
import { ROUTES } from "@/app/_lib/routes";
import { RootState } from "@/app/_lib/store";
import { useAppDispatch, useAppSelector } from "@/app/_lib/store/hooks";
import { Popover, Skeleton } from "antd";
import Link from "next/link";
import Button from "@/app/_components/general/button";
import { destroyUserState } from "@/app/_lib/store/user";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import avatar from "@/assets/icons/avatar.png";

import account from "@/assets/icons/dashboard/account.png"
import accountActive from "@/assets/icons/dashboard/accountActive.png"
import analytics from "@/assets/icons/dashboard/analytic.svg"
import analyticsActive from "@/assets/icons/dashboard/analyticActive.svg"
import bm from "@/assets/icons/dashboard/bm.png"
import bmActive from "@/assets/icons/dashboard/bmActive.png"
import draft from "@/assets/icons/dashboard/drafts.png"
import draftActive from "@/assets/icons/dashboard/draftsActive.png"
import fb from "@/assets/icons/dashboard/fb.svg"
import fbActive from "@/assets/icons/dashboard/fbActive.svg"
import users from "@/assets/icons/dashboard/users.png"
import usersActive from "@/assets/icons/dashboard/usersActive.png"
import notif from "@/assets/icons/dashboard/notif.png"
import notifActive from "@/assets/icons/dashboard/notifActive.png"
import settings from "@/assets/icons/dashboard/settings.svg";
import settingsActive from "@/assets/icons/dashboard/settingsActive.svg";
import trendingIcon from "@/assets/icons/dashboard/trendingIcon.svg"
import arrowRightIcon from "@/assets/icons/arrow-right.png";
import chatIcon from "@/assets/icons/dashboard/chat.png";
import chatActiveIcon from "@/assets/icons/dashboard/chat-active.png";
import { useEffect, useRef } from "react";
import { useGetTopCategoriesQuery } from "@/app/_lib/api/post";

const overviewLinks = [
  {
    title: "Feed",
    icon: fb,
    iconActive: fbActive,
    link: ROUTES.dashboard
  },
  {
    title: "Bookmarks",
    icon: bm,
    iconActive: bmActive,
    link: ROUTES.bookmarks
  },
  {
    title: "Drafts",
    icon: draft,
    iconActive: draftActive,
    link: ROUTES.drafts
  },
  {
    title: "Analytics",
    icon: analytics,
    iconActive: analyticsActive,
    link: ROUTES.analytics
  },
  {
    title: "Connect",
    icon: users,
    iconActive: usersActive,
    link: ROUTES.connect
  },
]
const personalLinks = [
  {
    title: "Account",
    icon: account,
    iconActive: accountActive,
    link: ROUTES.account
  },
  {
    title: "Chat",
    icon: chatIcon,
    iconActive: chatActiveIcon,
    link: ROUTES.chat
  },
  {
    title: "Notifications",
    icon: notif,
    iconActive: notifActive,
    link: ROUTES.notifications
  },
  {
    title: "Settings",
    icon: settings,
    iconActive: settingsActive,
    link: ROUTES.settings
  },
]
const headingClass = "font-[600] text-[#111] font-[18px] leading-[27px] w-full text-left "



export default function SideNav() {
  const path = usePathname();
  const sideNavRef = useRef<HTMLDivElement | null>(null);
  const openSideNavRef = useRef<HTMLButtonElement | null>(null);
  const classes = ["fixed"];
  const btnClasses = ["transform", "rotate-180"]

  useEffect(() => {
    const sideNavEl = sideNavRef.current;
    const openSideNavEl = openSideNavRef.current;
    if (sideNavEl && openSideNavEl) {
      const showNav = () => {
        if (sideNavEl.classList.contains("hidden")) {
          sideNavEl.classList.remove("hidden");
          sideNavEl.classList.add(...classes);
          openSideNavEl.classList.add(...btnClasses);
        }
      }
      const hideNav = () => {
        sideNavEl.classList.add("hidden");
        sideNavEl.classList.remove(...classes);
        openSideNavEl.classList.remove(...btnClasses);
      };
      const handleOpenNav = () => {
        if (sideNavEl.classList.contains("hidden"))
          showNav();
        else
          hideNav()
      }
      const handleClickEvent = (e: MouseEvent) => {
        const clickEl = e.target as HTMLElement;
        const isChildOfNav = sideNavEl.contains(clickEl) || openSideNavEl.contains(clickEl);
        if (!isChildOfNav) {
          hideNav();
        }
      }
      openSideNavEl.addEventListener("click", handleOpenNav);
      document.addEventListener("click", handleClickEvent);
      return () => {
        openSideNavEl.removeEventListener("click", handleOpenNav);
        document.removeEventListener("click", handleClickEvent);
      }
    }
  }, []);

  const closeOnLinkClick = () => {
    const sideNavEl = sideNavRef.current;
    const openSideNavEl = openSideNavRef.current;
    if (sideNavEl && openSideNavEl) {
      sideNavEl.classList.add("hidden");
      sideNavEl.classList.remove(...classes);
      openSideNavEl.classList.remove(...btnClasses);
    }
  }

  return (
    <>
      <div className="text-black w-[100%] max-w-[285px] flex flex-col items-center overflow-y-auto pt-[20px] nsm:pt-[90px] bg-[#fff] shadow-xl  h-[100vh] max-h-[calc(100vh-70px)] w-full nsm:w-[100%] hidden sm:block shadow-xl pb-[10vh]  left-0 top-0 nsm:max-h-[100vh] z-[8]" ref={sideNavRef} >
        <nav className="flex flex-col px-[20px] sm:px-[30px] items-center min-w-full">
          <section className="flex flex-col gap-4 w-[80%] mb-6">
            <h3 className={headingClass}>Overview</h3>
            <ul className="flex flex-col gap-2 ">
              {overviewLinks.map((link, i) => (
                <li key={i} onClick={closeOnLinkClick}>
                  <Link href={link.link} className={`flex gap-2 items-center ${path == link.link ? "text-[#543ee0]" : "hover:text-[#543ee0]"}`}>
                    <Image src={path == link.link ? link.iconActive : link.icon} alt={link.title} className="w-[20px] h-[20px]" /> {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <TopCategories closeOnLinkClick={closeOnLinkClick} />

          <section className="flex flex-col gap-4 w-[80%] mb-6">

            <h3 className={headingClass}>Personal</h3>
            <ul className="flex flex-col gap-2 ">
              {personalLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.link} className={`flex gap-2 items-center ${path == link.link ? "text-[#543ee0]" : "hover:text-[#543ee0]"}`} onClick={closeOnLinkClick}>
                    <Image src={path == link.link ? link.iconActive : link.icon} alt={link.title} className="w-[20px] h-[20px]" /> {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

        </nav>
      </div>

      <button className="bg-transparent outline-none sm:hidden fixed right-[10px] shadow-2xl border border-1 border-[#0001] top-[50%] translate-y-[-50%] h-[25px] w-[25px] bg-white sm:h-[30px] sm:w-[30px] rounded-full p-1 z-[21]" ref={openSideNavRef}>
        <Image src={arrowRightIcon} fill alt="arrow" objectFit="contain" objectPosition="center" />
      </button>
    </>

  )
}

function TopCategories({ closeOnLinkClick }: { closeOnLinkClick: () => void }) {
  const { data, isLoading } = useGetTopCategoriesQuery({});
  if (isLoading) {
    return <Skeleton active />
  }
  const categories: string[] = data?.data || [];
  if (categories.length === 0) return null;
  return (
    <section className="flex flex-col gap-4 w-[80%] mb-6">
      <h3 className={headingClass + " flex gap-1 leading-[110%]"}>Top Categories <Image src={trendingIcon} alt="" /></h3>
      <ul className="flex flex-col gap-2 ">
        {categories.map((category, i) => (
          <li key={i} onClick={closeOnLinkClick}>
            <Link href={`${ROUTES.category.replace(":category", category)}`} className="hover:text-[#543ee0]">#{category}</Link>
          </li>
        ))
        }
      </ul>
    </section>
  )
}
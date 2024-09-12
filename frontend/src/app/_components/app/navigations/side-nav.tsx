"use client"
import { ROUTES } from "@/app/_lib/routes";
import { RootState } from "@/app/_lib/store";
import { useAppDispatch, useAppSelector } from "@/app/_lib/store/hooks";
import { Popover } from "antd";
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
import notif from "@/assets/icons/dashboard/notif.png"
import notifActive from "@/assets/icons/dashboard/notifActive.png"
import settings from "@/assets/icons/dashboard/settings.svg";
import settingsActive from "@/assets/icons/dashboard/settingsActive.svg";
import trendingIcon from "@/assets/icons/dashboard/trendingIcon.svg"

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
]
const personalLinks = [
  {
    title: "Account",
    icon: account,
    iconActive: accountActive,
    link: ROUTES.account
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
    iconActive: accountActive,
    link: ROUTES.settings
  },
]



export default function SideNav() {
  const path = usePathname()
  const { info } = useAppSelector((state: RootState) => state.user);
  const trendingTags = ["programming", "data science", "technology", "machine learning", "politics"]

  const headingClass = "font-[600] text-[#111] font-[18px] leading-[27px] w-full text-left "


  return (
    <div className="w-full">

      <div className="text-black w-[100%]flex flex-col items-center overflow-y-auto  pt-[80px] z-[5] pb-20  bg-[#fff] shadow-xl  h-[100vh]">
        <nav className="flex flex-col h-[70px] px-[30px] justify-between items-center min-w-full  nsm:hidden z-[5] s">
          <section className="flex flex-col gap-4 w-[80%] mb-6">
            <h3 className={headingClass}>Overview</h3>
            <ul className="flex flex-col gap-2 ">
              {overviewLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.link} className={`flex gap-2 items-center ${path == link.link ? "text-[#543ee0]" : "hover:text-[#543ee0]"}`}>
                    <Image src={path == link.link ? link.iconActive : link.icon} alt={link.title} className="w-[20px] h-[20px]" /> {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-4 w-[80%] mb-6">
            <h3 className={headingClass + " flex gap-1"}>Trending Tags <Image src={trendingIcon} alt="" /></h3>
            <ul className="flex flex-col gap-2 ">
              {trendingTags.map((tags, i) => (
                <li key={i}>
                  <Link href={tags} className="hover:text-[#543ee0]">#{tags}</Link>
                </li>
              ))
              }
            </ul>
          </section>
          <section className="flex flex-col gap-4 w-[80%] mb-6">

            <h3 className={headingClass}>Overview</h3>
            <ul className="flex flex-col gap-2 ">
              {personalLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.link} className={`flex gap-2 items-center ${path == link.link ? "text-[#543ee0]" : "hover:text-[#543ee0]"}`}>
                    <Image src={path == link.link ? link.iconActive : link.icon} alt={link.title} className="w-[20px] h-[20px]" /> {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

        </nav>
      </div>
    </div>

  )
}
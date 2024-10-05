"use client";
import { ROUTES } from "@/app/_lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostButton() {
  const pathname = usePathname() as ROUTES;
  const [hide, setHide] = useState(false);


  useEffect(() => {
    const dontShow = pathname.includes(ROUTES.chat) || pathname.includes(ROUTES.post) || pathname.includes(ROUTES.scribe) || pathname.includes(ROUTES.settings) || pathname.includes(ROUTES.account) || pathname.includes(ROUTES.accountEdit);

    if (dontShow) setHide(true);
    else setHide(false);

  }, [pathname]);

  if (hide) return null;

  return (
    <Link href={ROUTES.scribe} className=" bg-[#543ee0] rounded-full outline-none lg:w-[60px] lg:h-[60px] h-[40px] w-[40px] text-white text-[28px] font-bold fixed z-[10] bottom-[5%] right-[5%] flex items-center justify-center leading-[100%] pb-2">
      +
    </Link>
  )
}
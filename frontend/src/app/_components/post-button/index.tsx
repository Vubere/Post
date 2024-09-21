import { ROUTES } from "@/app/_lib/routes";
import Link from "next/link";

export default function PostButton() {

  return (
    <Link href={ROUTES.scribe} className=" bg-[#543ee0] rounded-full outline-none lg:w-[60px] lg:h-[60px] h-[40px] w-[40px] text-white text-[28px] font-bold fixed z-[10] bottom-[5%] right-[5%] flex items-center justify-center leading-[100%] pb-2">
      +
    </Link>
  )
}
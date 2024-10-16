"use client"
import { ROUTES } from "@/app/_lib/routes";
import { RootState } from "@/app/_lib/store";
import { useAppDispatch, useAppSelector } from "@/app/_lib/store/hooks";
import { Popover } from "antd";
import Link from "next/link";
import Button from "@/app/_components/general/button";
import { destroyUserState } from "@/app/_lib/store/user";
import { useRouter } from "next/navigation";
import Image from "next/image";
import avatar from "@/assets/icons/avatar.png";
import { Jacques_Francois } from "next/font/google";

const Jacques = Jacques_Francois({
  weight: ["400"],
  subsets: ["latin"]
})



export default function AppHeader() {
  const { info } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    dispatch(destroyUserState());
    router.push(ROUTES.home);
  }

  return (
    <header className="flex min-h-[60px] h-[60px] sm:min-h-[70px] sm:h-[70px] px-[18px] relative shadow-xl xs:px-[20px] sm:px-[30px] justify-between items-center min-w-full z-[10] bg-white">
      <h1 className={`font-bold  text-[21px] xs:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] text-black bg-white ${Jacques.className}`}>Collections</h1>
      <Popover
        className="w-[100px] h-[30px] relative"
        content={(
          <ul className="grid gap-1 text-[16px] px-[10px]">
            <li>
              <Link href={ROUTES.account}>
                Profile
              </Link>
            </li>
            <li>
              <Link href={ROUTES.settings}>
                Settings
              </Link>
            </li>
            <li>
              <Button onClick={logout} className="" theme="danger" adjustSize="small">
                Logout
              </Button>
            </li>
          </ul>
        )}
      >
        <div className="flex gap-2 cursor-pointer items-center">
          <span className="block relative rounded-full w-[30px] h-[30px] min-w-[30px] min-h-[30px] border">
            <Image alt={info?.firstName || ""} fill src={info?.profilePhoto || avatar} objectFit="cover" objectPosition="center" className="rounded-full" />
          </span>
          <span className=" block w-full bg-white text-black text-black text-sm truncate">{info?.firstName?.[0]}{info?.lastName?.[0]}</span>
        </div>
      </Popover>

    </header>
  )
}
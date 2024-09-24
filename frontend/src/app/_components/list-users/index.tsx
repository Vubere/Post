"use client";
import { User } from "@/app/_lib/type";
import Image from "next/image";
import avatar from "@/assets/icons/avatar.png";

import PageContainer from "@/app/_components/general/page-container";
import FollowButton from "@/app/_components/follow-button";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import { useAppSelector } from "@/app/_lib/store/hooks";
import Empty from "../empty";


export default function ListUsers({ users }: { users: User[] }) {

  return <>
    {
      users?.length ?
        users.map((user) => (
          <UserDisplay user={user} />
        )) :
        <Empty text="No Users here" />
    }
  </>
}

const UserDisplay = ({ user }: { user: User }) => {
  const { info } = useAppSelector(state => state.user);

  return (
    <div className="flex justify-between items-center max-w-[270px]">
      <Link href={ROUTES.accountId.replace(":id", user._id || "")} className="flex items-center gap-2 relative">

        <div className="relative w-[40px] h-[40px]  rounded-full overflow-hidden">
          <Image src={user?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
        </div>
        <div>
          <p className="font-medium text-[14px] sm:text-[16px]"> {user?.firstName} {user?.lastName}</p>
          <p className="text-[8px] sm:text-[11px] text-[#373737aa] italic">@{user?.username}</p>
        </div>
      </Link>
      {info?._id === user._id ?
        <Link href={ROUTES.account} className="underline text-[12px] sm:text-[14px] italic hover:text-blue-300">Go to Profile</Link>
        :
        <FollowButton user={user} />
      }
    </div>
  )
}
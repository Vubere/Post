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
import { useLazyGetAllUsersQuery } from "@/app/_lib/api/user";
import InfiniteScroll from "../infinite-scroll";
import { loadMoreItems } from "@/app/_lib/services";


export default function ListUsers({ users, query }: { users: User[], query?: Record<string, any> }) {
  const [getUsers, { isLoading }] = useLazyGetAllUsersQuery();

  return <>
    {
      users?.length ?
        <InfiniteScroll
          limit={20}
          isLoading={isLoading}
          error={false}
          storageKey={"connect-users"}
          loadMore={(page) => loadMoreItems(page, getUsers, 20, query)}
          initialData={users}
          hasMore={users?.length < 20}
          Element={UserDisplay}
        />
        :
        <Empty text="No Users here" />
    }
  </>
}

const UserDisplay = ({ ...user }: User) => {
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
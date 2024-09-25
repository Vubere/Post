"use client";
import avatar from "@/assets/icons/avatar.png";
import editIcon from "@/assets/icons/edit.png";
import PageContainer from "@/app/_components/general/page-container";
import { useAppSelector } from "@/app/_lib/store/hooks";
import Image from "next/image";
import { RootState } from "@/app/_lib/store";
import Button from "@/app/_components/general/button";
import Tab from "@/app/_components/tab";
import { useGetAllPostsQuery, useGetPraiseQuery, useGetUserPostQuery, useLazyGetPraiseQuery, useLazyGetUserPostQuery } from "@/app/_lib/api/post";
import { useMemo } from "react";
import PostDisplay from "@/app/_components/post-display";
import { Post, User } from "@/app/_lib/type";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";
import FollowButton from "@/app/_components/follow-button";
import InfiniteScroll from "@/app/_components/infinite-scroll";
import { loadMoreItems } from "@/app/_lib/services";


export default function Account({ userInfo }: { userInfo: User }) {
  const { info } = useAppSelector(state => state.user);

  const isUserAccount = info?._id === userInfo?._id;
  const { data: userPost, isLoading: userPostLoading } = useGetUserPostQuery({
    userId: userInfo._id || userInfo.id
  });
  const [getUserPost, { isLoading: userPostFetching }] = useLazyGetUserPostQuery();
  const [getPraise, { isLoading: praisedPostFetching }] = useLazyGetPraiseQuery();
  const { data: praisedPost, isLoading: praisedPostLoading } = useGetPraiseQuery({
    userId: userInfo._id || userInfo.id
  });

  const userPostArray = userPost?.data || [];
  const praisedPostArray = praisedPost?.data || [];

  const extraSections = userInfo?.profileSections;

  const Items = [
    {
      content:
        <InfiniteScroll
          limit={10}
          isLoading={userPostLoading || userPostFetching}
          error={false}
          storageKey={"account-posts"}
          loadMore={(page) => loadMoreItems(page, getUserPost, 10, { userId: userInfo._id || userInfo.id })}
          initialData={userPostArray}
          hasMore={userPostArray.count < 10}
          Element={PostDisplay}
        />, title: "Posts", loading: userPostLoading
    },
    {
      content:
        <InfiniteScroll
          limit={10}
          isLoading={praisedPostLoading || praisedPostFetching}
          error={false}
          storageKey={"account-praises"}
          loadMore={(page) => loadMoreItems(page, getPraise, 10, { userId: userInfo._id || userInfo.id })}
          initialData={praisedPostArray}
          hasMore={praisedPostArray.count < 10}
          Element={PostDisplay}
        />, title: "Praises", loading: praisedPostLoading
    },
  ]

  return (
    <PageContainer title="Account">
      <div className="flex flex-col gap-4">
        <section className={SECTION_CLASSNAME}>
          <div className="flex justify-between items-end relative">

            <div className="flex items-center gap-2 relative mb-2 px-2">
              <div className="relative w-[80px] h-[80px]  rounded-full overflow-hidden">
                <Image src={userInfo?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
              </div>
              <div>
                <p className="font-medium text-[14px] sm:text-[16px]">{userInfo?.firstName} {userInfo?.lastName}</p>
                <p className="text-[8px] sm:text-[11px] text-[#373737aa] italic">@{userInfo?.username}</p>
              </div>
            </div>
            {isUserAccount ? (<div className="absolute right-0 xs:right-2 top-2 xs:top-3 sm:top-4 z-[4]" title="edit">
              <Link href={ROUTES.accountEdit} className="relative block rounded-full !w-[20px] !h-[20px] !border-none !bg-transparent cursor-pointer" >
                <Image src={editIcon} alt="edit" objectFit="cover" objectPosition="center" fill />
              </Link>
            </div>) : (<div className="absolute right-0 xs:right-2 top-4 xs:top-6 sm:top-8 z-[4]" >
              <div className="w-full flex justify-end">

                <FollowButton user={userInfo} />
              </div>

            </div>)}
            <ul className="gap-2 flex flex text-[12px] italics sm:text-[14px]">
              <li>
                <Link href={ROUTES.followers.replace(":id", userInfo._id as string)}>
                  {userInfo.followers?.length}&nbsp;Followers
                </Link>
              </li>
              <li>
                <Link href={ROUTES.following.replace(":id", userInfo._id as string)}>
                  {userInfo.following?.length}&nbsp;Following
                </Link>
              </li>
            </ul>
          </div>
          {userInfo?.biography && (
            <p className=" text-[#373737aa] px-2">{userInfo?.biography}</p>
          )}
        </section>

        {!!extraSections?.length && (
          <section className={`${SECTION_CLASSNAME} flex flex-col gap-4 px-2`}>
            {
              extraSections.map(({ name, content }: { name: string, content: string }) => (
                <article key={name} className="flex flex-col gap-1">
                  <h4 className="font-bold text-[14px] sm:text-[16px]">{name}</h4>
                  <p className="text-[11px] xs:text-[14px] sm:text-[16px] xs:text  text-[#373737aa]">{content}</p>
                </article>
              ))
            }
          </section>
        )}

        <Tab
          items={Items}
          loading={praisedPostLoading || userPostLoading}
        />

      </div>
    </PageContainer>
  )
}
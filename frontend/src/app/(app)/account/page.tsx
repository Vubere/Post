"use client";
import avatar from "@/assets/icons/avatar.png";
import editIcon from "@/assets/icons/edit.png";
import PageContainer from "@/app/_components/general/page-container";
import { useAppSelector } from "@/app/_lib/store/hooks";
import Image from "next/image";
import { RootState } from "@/app/_lib/store";
import Button from "@/app/_components/general/button";
import Tab from "@/app/_components/tab";
import { useGetAllPostsQuery, useGetPraiseQuery, useGetUserPostQuery } from "@/app/_lib/api/post";
import { useMemo, useState } from "react";
import PostDisplay from "@/app/_components/post-display";
import { Post } from "@/app/_lib/type";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";


export default function Account() {
  const { info } = useAppSelector((state: RootState) => state.user);

  const { data: userPost, isLoading: userPostLoading } = useGetUserPostQuery({});
  const { data: praisedPost, isLoading: praisedPostLoading } = useGetPraiseQuery({});

  const praisedPostArray = praisedPost?.data;
  const userPostArray = userPost?.data;

  const extraSections = info?.profileSections;


  const LikesContent = useMemo(() => (praisedPostArray || []).map((data: Post) => <PostDisplay {...(data as Post)} isAuthorPost={info?.id === data.author} className={SECTION_CLASSNAME} />), [praisedPostArray, praisedPostLoading]);
  const UserPostContent = useMemo(() => (userPostArray || []).map((data: Post) => <PostDisplay {...(data as Post)} isAuthorPost className={SECTION_CLASSNAME} />), [userPostArray, userPostLoading]);

  const Items = [
    { content: UserPostContent, title: "Posts", loading: userPostLoading },
    { content: LikesContent, title: "Likes", loading: praisedPostLoading },
  ]

  return (
    <PageContainer title="Account">
      <div className="flex flex-col gap-4">
        <section className={SECTION_CLASSNAME}>
          <div className="flex items-center gap-2 relative mb-2">
            <div className="relative w-[80px] h-[80px]  rounded-full overflow-hidden">
              <Image src={info?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
            </div>
            <div>
              <p className="font-medium text-[14px] sm:text-[16px]">{info?.firstName} {info?.lastName}</p>
              <p className="text-[8px] sm:text-[11px] text-[#373737aa] italic">@{info?.username}</p>
            </div>
            <div className="absolute right-0 xs:right-2 top-2 xs:top-3 sm:top-4 z-[4]" title="edit">
              <Link href={ROUTES.accountEdit} className="relative block rounded-full !w-[20px] !h-[20px] !border-none !bg-transparent cursor-pointer" >
                <Image src={editIcon} alt="edit" objectFit="cover" objectPosition="center" fill />
              </Link>
            </div>
          </div>
          {info?.biography && (
            <p className=" text-[#373737aa] px-2">{info?.biography}</p>
          )}
        </section>

        {!!extraSections?.length && (
          <section className={`${SECTION_CLASSNAME} flex flex-col gap-4`}>
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
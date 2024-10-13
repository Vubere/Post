"use client";
import { Post, User } from "@/app/_lib/type";
import Image from "next/image";
import avatar from "@/assets/icons/avatar.png";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import { TYPE_CLASSNAME } from "@/app/_lib/utils/constants";
import React, { useRef } from "react";
import { startCase } from "lodash";


interface PostDisplay extends Post {
  isAuthorPost?: boolean;
  className?: string,
  hideReaction?: boolean,
  shadow?: boolean,
  showEdit?: boolean
}

export default function PostDisplay({ hideReaction, className, shadow = true, showEdit = true, ...post }: PostDisplay) {
  const author = (post?.authorDetails || post?.author) as User;

  const postContainerRef = useRef<HTMLElement | null>(null);

  return (
    <article className={`p-2 px-4 ${shadow ? "shadow-[#37373744] shadow-[0_4px_12px_rgba(0,0,0,0.1)]" : ""} ${className}`} ref={postContainerRef}>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 relative">
          <div className="relative w-[40px] h-[40px]  rounded-full overflow-hidden">
            <Image src={author?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
          </div>
          <div>
            <p className="font-medium text-[14px] sm:text-[16px]"> {author?.firstName} {author?.lastName}</p>
            <p className="text-[8px] sm:text-[11px] text-[#373737aa] italic">@{author?.username}</p>
          </div>
          {(post?.type && post.postType !== "reshare") && <div className={`font-light rounded-full px-2 text-[11px] sm:text-[14px] ${TYPE_CLASSNAME[startCase(post.type || "") as keyof typeof TYPE_CLASSNAME]}`}>
            {startCase(post?.type || "")}
          </div>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {post?.coverPhoto ? <div className="relative w-full rounded-[8px] h-[200px] overflow-hidden mb-2 sm:mb-4">
          <Image src={post?.coverPhoto} alt={post?.title} fill objectFit="cover" objectPosition="center" />
        </div> : <div className="w-full h-[200px] bg-gray-200 rounded-[8px] mb-2 sm:mb-4 flex items-center justify-center text-[#373737aa] font-bold text-[28px] sm:text-[34px] md:text-[48px] lg:text-[54px]">{post?.title}</div>}
        <h2 className="text-[24px] xs:text-[28px] lg:text-[34px] font-bold leading-[110%]">{post?.title}</h2>
        <p className="text-[12px] xs:text-[14px] sm:text-[16px] md:text-[18px] text-[#373737aa]">{post?.synopsis}</p>

        <Link href={ROUTES.openPost.replace(":id", `${post.id || post._id}`)} className="underline font-medium italic text-[#22bb99] w-[120px]">Read</Link>
      </div>

    </article>
  )
}

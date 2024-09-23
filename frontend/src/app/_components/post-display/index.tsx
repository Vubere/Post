"use client";
import { Post, User } from "@/app/_lib/type";
import Image from "next/image";
import avatar from "@/assets/icons/avatar.png";
import Button from "../general/button";
import editIcon from "@/assets/icons/dot-menu.png";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import { Popover, Skeleton } from "antd"
import PostReactions from "./post-reactions";
import { TYPE_CLASSNAME } from "@/app/_lib/utils/constants";
import { useEffect, useState } from "react";
import { useLazyGetUserQuery } from "@/app/_lib/api/user";


interface PostDisplay extends Post {
  isAuthorPost: boolean;
  className?: string,
  hideReaction?: boolean,
}

export default function PostDisplay({ isAuthorPost, hideReaction, className, ...post }: PostDisplay) {
  const author = post?.authorDetails || post?.author;
  const [fetchedAuthor, setFetchedAuthor] = useState<null | User>(null);
  const [getUser, { isLoading }] = useLazyGetUserQuery();
  useEffect(() => {
    if (author !== undefined && typeof author === "string") {
      getUser(author)
        .then(res => {
          console.log(res)
          const status = (res.data as any)?.status
          if (status === "success") {
            const user = (res.data as any)?.data as User;
            setFetchedAuthor(user);
          }
        });
    } else {
      setFetchedAuthor(author as User)
    }
  }, [author]);
  if (isLoading) {
    return (
      <Skeleton />
    )
  }

  return (
    <article className={"px-2 " + className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 relative">

          <div className="relative w-[40px] h-[40px]  rounded-full overflow-hidden">
            <Image src={fetchedAuthor?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
          </div>
          <div>
            <p className="font-medium text-[14px] sm:text-[16px]"> {fetchedAuthor?.firstName} {fetchedAuthor?.lastName}</p>
            <p className="text-[8px] sm:text-[11px] text-[#373737aa] italic">@{fetchedAuthor?.username}</p>
          </div>
          {(post?.type && post.postType !== "reshare") && <div className={`font-light rounded-full px-2 py-1 text-[11px] sm:text-[14px] ${TYPE_CLASSNAME[post.type]}`}>
            {post?.type}
          </div>}
        </div>

        {isAuthorPost &&
          <Popover
            content={
              <ul>
                <li><Link className="text-[12px] xs:text-[14px] sm:text-[16px]" href={ROUTES.scribeId.replace(":id", post._id || "")}>Edit</Link></li>
              </ul>
            }
          >
            <div className="" title="options">
              <Button theme="light" className="relative block rounded-full !w-[20px] !h-[40px] !border-none !bg-transparent" >
                <Image src={editIcon} alt="" fill objectFit="contain" objectPosition="center" />
              </Button>
            </div>
          </Popover>
        }
      </div>
      {
        post?.postType !== "reshare" ? (

          <div className="flex flex-col gap-1">
            {post?.coverPhoto && <div className="relative w-full rounded-[8px] h-[200px] overflow-hidden mb-2 sm:mb-4">
              <Image src={post?.coverPhoto} alt={post?.title} fill objectFit="cover" objectPosition="center" />
            </div>}
            <h2 className="text-[24px] xs:text-[28px] lg:text-[34px] font-bold leading-[110%]">{post?.title}</h2>
            <p className="text-[12px] xs:text-[14px] sm:text-[16px] md:text-[18px] text-[#373737aa]">{post?.synopsis}</p>

            <Link href={ROUTES.postId.replace(":id", `${post.id || post._id}`)} className="underline font-medium italic text-[#22bb99]">Read</Link>
          </div>
        ) : <div>
          <p className="text-[14px] xs:text-[16px] sm:text-[18px] md:text-[21px] text-[#373737] pb-2">
            <Link href={ROUTES.postId.replace(":id", `${post.id || post._id}`)} className="block">
              {post?.content}</Link>
          </p>
          <div className="w-[95%] mx-auto h-full pl-2 border-l-4 border-[#0005]  ">
            {post.sharedPostDetails ? (
              <Link href={ROUTES.postId.replace(":id", `/${post?.sharedPostDetails?.id || post?.sharedPostDetails?._id}`)} className="block">
                <PostDisplay {...(post?.sharedPostDetails as Post)} hideReaction isAuthorPost={false} />
              </Link>
            ) : null}
          </div>
        </div>
      }

      {!hideReaction ? <PostReactions {...post} showReads /> : null}

    </article>
  )
}

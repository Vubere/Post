"use client";
import see from "@/assets/icons/see.png";
import seen from "@/assets/icons/seen.png";
import reads from "@/assets/icons/read.png";
import readYes from "@/assets/icons/readYes.png";
import praise from "@/assets/icons/praise.png";
import praised from "@/assets/icons/praised.png";
import repost from "@/assets/icons/repost.png";
import reposted from "@/assets/icons/reposted.png";
import comment from "@/assets/icons/comment.svg";
import { useEffect, useState } from "react";
import { usePraisePostMutation, useUnpraisePostMutation } from "@/app/_lib/api/post";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { RootState } from "@/app/_lib/store";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_lib/type";
import { ROUTES } from "@/app/_lib/routes";
import Image from "next/image";

interface PostReactionProp extends Partial<Post> {
  showViews?: boolean,
  showReads?: boolean,
  isPostPage?: boolean
}

export default function PostReactions({ showViews, showReads, isPostPage, ...post }: PostReactionProp) {
  const { info } = useAppSelector((state: RootState) => state.user);
  const router = useRouter();
  const authorId = info?._id || info?.id || "";

  const rpc = post?.resharedBy?.length || 0;
  const lc = post?.praises?.length || 0;
  const isSeen = !!post?.views?.includes(authorId);
  const isRead = !!post?.reads?.includes(authorId);
  const isPraised = !!post?.praises?.includes(authorId);
  const isReposted = !!post?.resharedBy?.includes(authorId);
  const [praiseCount, setPraiseCount] = useState(lc);
  const [repostCount, setRepostCount] = useState(rpc);
  const [praiseBool, setPraiseBool] = useState(false);
  const [repostBool, setRepostBool] = useState(false);
  const [praisePost] = usePraisePostMutation();
  const [unpraisePost] = useUnpraisePostMutation();
  const [share] = usePraisePostMutation();
  const [unsharePost] = useUnpraisePostMutation();

  useEffect(() => {
    setPraiseBool(isPraised);
    setRepostBool(isReposted);
    setRepostCount(rpc);
    setPraiseCount(lc);
  }, [rpc, lc, isPraised, isReposted]);

  return (
    <ul className="flex justify-around px-4 mt-4">
      {[
        ...(showViews ? [{
          icon: isSeen ? seen : see,
          number: post?.views?.length || 0,
          onClick: () => {

          },
          tooltip: "views"
        }] : []),
        ...(showReads ? [{
          icon: isRead ? readYes : reads,
          number: post?.reads?.length || 0,
          onClick: () => {

          },
          tooltip: "reads"
        }] : []),
        {
          icon: comment,
          number: post?.comments?.length || 0,
          onClick: () => {
            if (!isPostPage) {
              router.push(ROUTES.postId.replace(":id", `/${post._id || post.id}?comment=yes`));
            } else {

            }
          },
          tooltip: "comment"
        },
        {
          icon: repostBool ? reposted : repost,
          number: repostCount,
          onClick: () => {

            if (!repostBool) {
              setRepostBool(true);
              setRepostCount(prev => prev + 1);
              share(post._id as string)
                .then((res) => {
                  console.log(res);
                  const err = res?.error as any;
                  if (err && ["error", "failed"].includes(err?.data?.status)) {
                    setRepostBool(false);
                    setRepostCount(prev => prev - 1);
                  }
                });
            } else {
              setRepostBool(false);
              setRepostCount(prev => prev !== 0 ? prev - 1 : prev);
              unsharePost(post._id as string)
                .then((res) => {
                  console.log(res);
                  const err = res?.error as any;
                  if (err && ["error", "failed"].includes(err?.data?.status)) {
                    setPraiseBool(true);
                    setRepostCount(prev => prev + 1);
                  }
                });
            }

          },
          tooltip: repostBool ? "unshare" : "share"
        },
        {
          icon: praiseBool ? praised : praise,
          number: praiseCount,
          onClick: () => {
            if (!praiseBool) {
              setPraiseBool(true);
              setPraiseCount(prev => prev + 1);
              praisePost(post._id as string)
                .then((res) => {
                  const err = res?.error as any;
                  if (err && ["error", "failed"].includes(err?.data?.status)) {
                    setPraiseBool(false);
                    setPraiseCount(prev => prev - 1);
                  }
                });
            } else {
              setPraiseBool(false);
              setPraiseCount(prev => prev !== 0 ? prev - 1 : prev);
              unpraisePost(post._id as string)
                .then((res) => {
                  const err = res?.error as any;
                  if (err && ["error", "failed"].includes(err?.data?.status)) {
                    setPraiseBool(true);
                    setPraiseCount(prev => prev + 1);
                  }
                });
            }
          },
          tooltip: praiseBool ? "unpraise" : "praise"
        },
      ].map(({ icon, number, onClick, tooltip }) => (<li className="flex flex-col items-center">
        <div className="relative cursor-pointer w-[20px] h-[20px]" onClick={onClick} title={tooltip} aria-disabled={tooltip === "reads"}>
          <Image src={icon} alt="" fill objectFit="contain" objectPosition="center" />
        </div>
        <span className="text-[12px] text-[#373737]">{number}</span>
      </li>))}
    </ul>
  )
}
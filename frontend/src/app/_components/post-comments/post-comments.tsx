"use client";
import see from "@/assets/icons/see.png";
import reads from "@/assets/icons/read.png";
import praise from "@/assets/icons/praise.png";
import praised from "@/assets/icons/praised.png";
import comment from "@/assets/icons/comment.svg";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { RootState } from "@/app/_lib/store";
import { useRouter } from "next/navigation";
import { Comments } from "@/app/_lib/type";
import { ROUTES } from "@/app/_lib/routes";
import Image from "next/image";
import { useUnPraiseCommentMutation, usePraiseCommentMutation } from "@/app/_lib/api/comment";

interface CommentReactionProps extends Partial<Comments> {
  showViews?: boolean,
  showReads?: boolean,
  isPostPage?: boolean
}

export default function CommentReaction({ showViews, showReads, isPostPage, ...comments }: CommentReactionProps) {
  const { info } = useAppSelector((state: RootState) => state.user);
  const router = useRouter();
  const authorId = info?._id || info?.id || "";

  const lc = comments?.praises?.length || 0;
  const isPraised = !!comments?.praises?.includes(authorId);
  const [praiseCount, setPraiseCount] = useState(lc);
  const [praiseBool, setPraiseBool] = useState(false);
  const [praisePost] = usePraiseCommentMutation();
  const [unpraisePost] = useUnPraiseCommentMutation();

  useEffect(() => {
    setPraiseBool(isPraised);
    setPraiseCount(lc);
  }, [lc, isPraised]);

  return (
    <ul className="flex justify-around px-4 mt-4">
      {[
        ...(showViews ? [{
          icon: see,
          number: comments?.views || 0,
          onClick: () => {

          },
          tooltip: "views"
        }] : []),
        ...(showReads ? [{
          icon: reads,
          number: comments?.reads || 0,
          onClick: () => {

          },
          tooltip: "reads"
        }] : []),
        {
          icon: comment,
          number: comments?.replies?.length || 0,
          onClick: () => {

          },
          tooltip: "reply"
        },
        {
          icon: praiseBool ? praised : praise,
          number: praiseCount,
          onClick: () => {
            if (!praiseBool) {
              setPraiseBool(true);
              setPraiseCount(prev => prev + 1);
              praisePost(comments._id as string)
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
              unpraisePost(comments._id as string)
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
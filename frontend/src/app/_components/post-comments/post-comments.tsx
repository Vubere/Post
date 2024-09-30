"use client";
import see from "@/assets/icons/see.png";
import reads from "@/assets/icons/read.png";
import praise from "@/assets/icons/praise.png";
import praised from "@/assets/icons/praised.png";
import commentIcon from "@/assets/icons/comment.svg";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { RootState } from "@/app/_lib/store";
import { useRouter } from "next/navigation";
import { Comments } from "@/app/_lib/type";
import { ROUTES } from "@/app/_lib/routes";
import Image from "next/image";
import { useUnPraiseCommentMutation, usePraiseCommentMutation, useReplyCommentMutation, useGetCommentRepliesQuery } from "@/app/_lib/api/comment";
import Modal from "../modal";
import { Form, Skeleton } from "antd";
import { NormalInput } from "../input";
import Button from "../general/button";
import { toast } from "react-toastify";
import { CommentDisplay } from ".";
interface CommentReactionProps extends Partial<Comments> {
  showViews?: boolean,
  validate?: () => void,
  showReads?: boolean,
  isPostPage?: boolean,
}

export default function CommentReaction({ showViews, showReads, isPostPage, validate, ...comment }: CommentReactionProps) {
  const { info } = useAppSelector((state: RootState) => state.user);
  const authorId = info?._id || info?.id || "";

  const lc = comment?.praises?.length || 0;
  const isPraised = !!comment?.praises?.includes(authorId);
  const [praiseCount, setPraiseCount] = useState(lc);
  const [praiseBool, setPraiseBool] = useState(false);
  const [praisePost] = usePraiseCommentMutation();
  const [unpraisePost] = useUnPraiseCommentMutation();
  const [sendReply, { isLoading: isReplying }] = useReplyCommentMutation();
  const [showReplies, setShowReplies] = useState(false);
  const [replyCommentShow, setShowReplyComment] = useState(false);
  const [reply, setReply] = useState("");
  useEffect(() => {
    setPraiseBool(isPraised);
    setPraiseCount(lc);
  }, [lc, isPraised]);


  const replyComment = () => {
    if (!reply.length) return toast.error("no reply text");
    sendReply({
      commentRepliedTo: (comment.id || comment._id) as string,
      content: reply,
      authorId: (info?._id || info?.id) as string,
      ownerId: comment?.authorId
    })
      .then((res) => {
        const data = res?.data;
        if (data?.status === "success") {
          toast.success(data?.message);
          setReply("");
          setShowReplyComment(false);
          validate?.();
        }
      })
  }
  return (
    <>
      <ul className="flex justify-around px-4 mt-4">
        {[
          ...(showViews ? [{
            icon: see,
            number: comment?.views || 0,
            onClick: () => {

            },
            tooltip: "views"
          }] : []),
          ...(showReads ? [{
            icon: reads,
            number: comment?.reads || 0,
            onClick: () => {

            },
            tooltip: "reads"
          }] : []),
          {
            icon: commentIcon,
            number: comment?.replies?.length || 0,
            onClick: () => {
              setShowReplyComment(true);
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
                praisePost(comment._id as string)
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
                unpraisePost(comment._id as string)
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
        ].map(({ icon, number, onClick, tooltip }, i) => (<li className="flex flex-col items-center" key={i}>
          <div className="relative cursor-pointer w-[20px] h-[20px]" onClick={onClick} title={tooltip} aria-disabled={tooltip === "reads"}>
            <Image src={icon} alt="" fill objectFit="contain" objectPosition="center" />
          </div>
          <span className="text-[12px] text-[#373737]">{number}</span>
        </li>))}
      </ul>
      {(comment?.replies?.length || -1) > 0 ? (
        <div>
          <button className="bg-transparent outline-none border-none font-bold text-[12px] xs:text-[14px] sm:text-[15px] md:text-[16px] italic text-[#37373788] hover:underline" onClick={() => setShowReplies(prev => !prev)}>
            {showReplies ? "hide replies" : "show replies"}
          </button>
        </div>) : null}

      {
        showReplies ? (
          <CommentReplies {...comment} />
        ) : null
      }
      {
        replyCommentShow ? (
          <Modal open={replyCommentShow} close={() => setShowReplyComment(false)} className="px-6 py-2 bg-white bg-opacity-40 backdrop-blur-[10px] max-w-[95%] h-[200px] w-[400px] shadow-xl py-10 pt-[40px] ">
            <div>
              <p className="text-[#000] font-bold">
                Reply {comment.authorDetails?.username}'s comment:
              </p>
              <p className="italic text-[14px]">{comment.content}</p>
            </div>
            <Form onFinish={replyComment} className="mt-4">
              <NormalInput type="textarea" twHeight="h-auto" name="reply" label="Reply" placeholder="Reply" value={reply} onChange={({ target: { value } }) => {
                setReply(value);
              }} />
              <Button text="REPLY" type="submit" loading={isReplying} disabled={isReplying} />
            </Form>
          </Modal>
        ) : null
      }
    </>
  )
}


function CommentReplies({ id, _id }: Partial<Comments>) {
  const { data, isLoading, refetch } = useGetCommentRepliesQuery({
    commentRepliedTo: (id || _id) as string
  });
  const { info } = useAppSelector((state: RootState) => state.user)

  if (isLoading) {
    return (
      <Skeleton />
    )
  }
  const comments = (data?.data || []) as Comments[];

  return (
    <div className="border-l-4 border-[#0004] pl-3">
      {
        comments.map((comment, i) =>
          <CommentDisplay key={comment._id || i} isAuthorComment={comment.authorId === info?._id} {...comment} validate={refetch} />)
      }
    </div>
  )
}


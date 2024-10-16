"use client";

import { useCreateCommentMutation, useDeleteCommentMutation, useGetPostCommentsQuery } from "@/app/_lib/api/comment";
import { Comments, Post } from "@/app/_lib/type";
import { Form, Modal, Popover, Skeleton } from "antd";
import Empty from "../empty";
import Input from "../input";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../general/button";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { RootState } from "@/app/_lib/store";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import editIcon from "@/assets/icons/dot-menu.png";
import avatar from "@/assets/icons/avatar.png";
import CommentReaction from "./post-comments";
import { useState } from "react";
import { toast } from "react-toastify";

interface PostCommentsProps extends Post {
  disabled: boolean
}

export default function PostComments({ _id, disabled, ...post }: PostCommentsProps) {
  const { info } = useAppSelector((state: RootState) => state.user)
  const { data, isLoading, refetch } = useGetPostCommentsQuery({
    postId: _id || post?.id || ""
  });
  const comments: Comments[] = data?.data || [];
  if (isLoading) return (
    <div className="my-4">
      <Skeleton />
    </div>
  )

  return (
    <section className="mt-12 sm:mt-20">
      <div>
        <CommentForm postId={(_id || post.id) as string} authorId={(info?.id || info?._id) as string} ownerId={post.authorDetails?._id || post?.author} validate={refetch} disabled={disabled} />
        {!comments.length ? (
          <div className="my-4">
            <Empty text="No comments" />
          </div>) :
          <div className="my-4">
            <h4 className="font-bold text-[16px] sm:text-[18px] md:text-[21px] mb-6">
              Comments
            </h4>
            <div>
              {comments.map((comment, i) => (
                <CommentDisplay validate={refetch} isAuthorComment={info?._id === comment.authorId} key={comment._id || i} {...comment} disabled={disabled} />
              ))}
            </div>
          </div>
        }
      </div>
    </section>
  )
}

const schema = yup.object({
  content: yup.string().required("come on bro??? you have to write a text to comment!").trim()
})

function CommentForm({ postId, ownerId, authorId, validate, disabled }: { postId: string, authorId: string, validate: any, ownerId?: string, disabled?: boolean }) {
  const [comment, { isLoading: isCommenting }] = useCreateCommentMutation();
  const { handleSubmit, reset, ...state } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit"
  });

  const onSubmit: SubmitHandler<{ content: string }> = (val) => {
    if (disabled) {
      toast.error("sign in to comment");
      return
    }
    comment({
      ...val,
      postId,
      authorId
    }).then(res => {
      reset()
      validate();
    })
  }
  return (
    <Form onFinish={handleSubmit(onSubmit)}>
      <Input type="textarea" name="content" label="Comment" state={state} twHeight="h-auto" />
      <Button text="Comment" type="submit" loading={isCommenting} disabled={isCommenting} />
    </Form>
  )
}

interface CommentDisplay extends Comments {
  isAuthorComment: boolean;
  className?: string,
  validate?: () => void;
  hideReactions?: boolean;
  disabled?: boolean;
}

export function CommentDisplay({ isAuthorComment, hideReactions, className, disabled, validate, ...comment }: CommentDisplay) {
  const [deleteComment, { isLoading }] = useDeleteCommentMutation();
  const [deleted, setDeleted] = useState(false);

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this comment?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => {
        deleteComment((comment._id || comment.id) as string).then(res => {
          if (res?.data?.status === "success") {
            setDeleted(true);
          }
        });
      },
    });
  }
  if (deleted) return null;

  return (
    <article className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 relative">

          <div className="relative w-[40px] h-[40px]  rounded-full overflow-hidden">
            <Image src={comment?.authorDetails?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
          </div>
          <div>
            <p className="font-medium text-[14px] sm:text-[16px]"> {comment?.authorDetails?.firstName} {comment?.authorDetails?.lastName}</p>
            <p className="text-[8px] sm:text-[11px] text-[#373737aa] italic">@{comment?.authorDetails?.username}</p>
          </div>
        </div>

        {isAuthorComment &&
          <Popover
            content={
              <ul>
                <li><Link className="text-[12px] xs:text-[14px] sm:text-[16px]" href={ROUTES.scribeId.replace(":id", comment._id || "")}>Edit</Link></li>
                <li><button className="text-[12px] xs:text-[14px] sm:text-[16px] hover:text-red-400" onClick={handleDelete} disabled={isLoading}>Delete</button></li>
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
      <div className="flex flex-col gap-1">
        <p className="text-[12px] xs:text-[14px] sm:text-[16px] md:text-[18px] text-[#373737aa]">{comment?.content}</p>
      </div>
      {!hideReactions && <CommentReaction {...comment} validate={validate} disabled={disabled} />}
    </article>
  )
}

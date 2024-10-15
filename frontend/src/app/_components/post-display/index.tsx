"use client";
import { Post, User } from "@/app/_lib/type";
import Image from "next/image";
import avatar from "@/assets/icons/avatar.png";
import Button from "../general/button";
import editIcon from "@/assets/icons/dot-menu.png";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import { Form, Popover, Modal as AntdModal, Skeleton } from "antd"
import PostReactions from "./post-reactions";
import { TYPE_CLASSNAME } from "@/app/_lib/utils/constants";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLazyGetUserQuery } from "@/app/_lib/api/user";
import { useClickPostMutation, useDeletePostMutation, usePayPaywallFeeMutation, useUpdatePostMutation, useViewPostMutation } from "@/app/_lib/api/post";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { RootState } from "@/app/_lib/store";
import { startCase, update } from "lodash";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { paywallCheck } from "@/app/_lib/services";
import { NormalInput } from "../input";
import Modal from "@/app/_components/modal";


interface PostDisplay extends Post {
  isAuthorPost?: boolean;
  className?: string,
  hideReaction?: boolean,
  shadow?: boolean,
  showEdit?: boolean
}

export default function PostDisplay({ hideReaction, className, shadow = true, showEdit = true, ...post }: PostDisplay) {
  const { info } = useAppSelector((state: RootState) => state.user)
  const [editedContent, setEditedContent] = useState("");
  const router = useRouter();
  const author = post?.authorDetails || post?.author;
  const isAuthorPost = typeof author === "string" ? author === info?._id : author?._id === info?._id;
  const [fetchedAuthor, setFetchedAuthor] = useState<null | User>(null);
  const [getUser, { isLoading }] = useLazyGetUserQuery();
  const [viewPost] = useViewPostMutation();
  const [clickPost] = useClickPostMutation();
  const [seen, setSeen] = useState(false);
  const shouldPaywall = useMemo(() => paywallCheck({ user: info as User, post }), [info, post]);
  const [payPaywallFee] = usePayPaywallFeeMutation();
  const [deletePost] = useDeletePostMutation();
  const [postIsDeleted, setPostIsDeleted] = useState(false);
  const postClicked = (id?: string) => {
    const clicked = post.clicks?.includes(id || info?._id || info?.id || "");
    if (!clicked) {
      clickPost((post._id || post.id) as string);
    }
  }
  const postContainerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (author !== undefined && typeof author === "string") {
      getUser(author)
        .then(res => {
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

  useEffect(() => {
    const postContainer = postContainerRef.current;
    if (postContainer && !seen) {
      const observer = new IntersectionObserver(([entry]) => {
        const viewed = post.views?.includes(info?._id || info?.id || "");
        if (!viewed) {
          viewPost((post._id || post.id) as string);
          setSeen(true);
        }
      });
      observer.observe(postContainer);
      return () => {
        observer.disconnect();
      };
    }
  }, [postContainerRef.current, seen]);

  if (isLoading) {
    return (
      <Skeleton />
    )
  }

  const confirmPayment = () => {
    AntdModal.confirm({
      title: `Pay one time fee of ${post.paywallFee} collects`,
      cancelText: "Cancel",
      okText: "Pay",
      onOk: () => {
        payPaywallFee({
          id: (post._id || post.id || "")
        }).then(res => {
          if (res.data?.status === "success") {
            toast.success("Payment successful");
            router.push(ROUTES.postId.replace(":id", post._id || post.id || ""));
          }
          else {
            toast.error("Payment failed");
          }
        }).catch(() => toast.error("Payment failed"));
      },
    })
  }

  const confirmDelete = () => {
    AntdModal.confirm({
      title: `delete post: "${post?.postType === "reshare" ? post.content : post.title}"`,
      cancelText: "Cancel",
      okText: "Delete",
      onOk: () => {
        deletePost((post._id || post.id || "")).then(res => {
          if (res.data === null) {
            toast.success("Deleted successfully");
            setPostIsDeleted(true);
          }
          else {
            toast.error("Delete failed");
          }
        }).catch(() => toast.error("Delete failed"));
      },
    })
  }

  const updateContentFromEdit = (content: string) => {
    setEditedContent(content);
  }

  if (postIsDeleted) return null;

  return (
    <article className={`p-2 px-4 ${shadow ? "shadow-[#37373744] shadow-[0_4px_12px_rgba(0,0,0,0.1)]" : ""} ${className}`} ref={postContainerRef}>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 relative">
          <Link href={ROUTES.accountId.replace(":id", fetchedAuthor?._id || fetchedAuthor?.id || "")}>
            <Image src={fetchedAuthor?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
          </Link>
          <Link href={ROUTES.accountId.replace(":id", fetchedAuthor?._id || fetchedAuthor?.id || "")}>
            <p className="font-medium text-[14px] sm:text-[16px]"> {fetchedAuthor?.firstName} {fetchedAuthor?.lastName}</p>
            <p className="text-[8px] sm:text-[11px] text-[#373737aa] italic">@{fetchedAuthor?.username}</p>
          </Link>
          {(post?.type && post.postType !== "reshare") && <div className={`font-light rounded-full px-2 text-[11px] sm:text-[14px] ${TYPE_CLASSNAME[startCase(post.type || "") as keyof typeof TYPE_CLASSNAME]}`}>
            {startCase(post?.type || "")}
          </div>}
          {post?.isPaywalled && (
            <div className="font-light text-[11px] sm:text-[14px] rounded-full bg-red-400 text-white inline-block text-center px-2 cursor-pointer" title={`A one time access fee of ${post?.paywallFee} collects is required to read post.`}>
              Paywalled
            </div>
          )}
        </div>
        {(isAuthorPost && showEdit) &&
          <Popover
            content={
              <ul>
                {post?.postType !== "reshare" ? (<li><Link className="text-[14px] sm:text-[16px]" href={ROUTES.scribeId.replace(":id", post._id || "")}>Edit</Link></li>) : (
                  <li><EditReshare post={post} className="text-[14px] sm:text-[16px] hover:text-green-300" updateContent={updateContentFromEdit} /></li>
                )}
                <li>
                  <button className="text-[12px] xs:text-[14px] sm:text-[16px]" onClick={confirmDelete}>
                    <span className="hover:text-[#f33]">
                      Delete
                    </span>
                  </button>
                </li>
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
            {(post?.categories?.length || 0) > 0 && <div className="flex flex-wrap gap-2 text-[12px] xs:text-[14px] sm:text-[16px] md:text-[18px] text-[#373737aa] mb-2">
              {post?.categories?.map((category, index) => <Link key={index} href={ROUTES.category.replace(":name", category)} className="underline  font-medium text-[#22bb99]">#{category}</Link>)}
            </div>}
            {post?.coverPhoto && <div className="relative w-full rounded-[8px] h-[200px] overflow-hidden mb-2 sm:mb-4">
              <Image src={post?.coverPhoto} alt={post?.title} fill objectFit="cover" objectPosition="center" />
            </div>}
            <h2 className="text-[24px] xs:text-[28px] lg:text-[34px] font-bold leading-[110%]">{post?.title}</h2>
            <p className="text-[12px] xs:text-[14px] sm:text-[16px] md:text-[18px] text-[#373737aa]">{post?.synopsis}</p>

            {shouldPaywall ? (<button className="underline font-medium italic text-[#22bb99] bg-transparent outline-none border-none inline-block w-[120px] text-start" onClick={confirmPayment}>
              Read
            </button>) : <Link href={ROUTES.postId.replace(":id", `${post.id || post._id}`)} className="underline font-medium italic text-[#22bb99] w-[120px]" onClick={() => postClicked()} >Read</Link>}
          </div>
        ) : <div>
          <p className="text-[14px] xs:text-[16px] sm:text-[18px] md:text-[21px] text-[#373737] pb-2">
            <Link href={ROUTES.postId.replace(":id", `${post.id || post._id}`)} className="block" onClick={() => postClicked()}>
              {editedContent || post?.content}</Link>
          </p>
          <div className="w-[95%] mx-auto h-full pl-2 border-l-4 border-[#0005]  ">
            {post.sharedPostDetails ? (
              <Link href={ROUTES.postId.replace(":id", `/${post?.sharedPostDetails?.id || post?.sharedPostDetails?._id}`)} className="block" onClick={() => postClicked(post?.sharedPostDetails?.id || post?.sharedPostDetails?._id)}>
                <PostDisplay {...(post?.sharedPostDetails as Post)} shadow={false} hideReaction isAuthorPost={false} showEdit={false} />
              </Link>
            ) : null}
          </div>
        </div>
      }
      {!hideReaction ? <PostReactions {...post} showReads /> : null}
    </article>
  )
}

const EditReshare: React.FC<{ post: Post, className: string, updateContent: (content: string) => void }> = ({ post, className, updateContent }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [content, setContent] = useState(post.content || "");
  const [editPost, {
    isLoading: isEditing
  }] = useUpdatePostMutation();

  const editPostContent = async (data: any) => {
    if (content === "") return toast.error("Please enter reshare content!");
    await editPost({
      id: (post?.id || post?._id) as string,
      content,
    }).then(res => {
      if (res?.data?.status === "success!") {
        updateContent(content);
        toast.success("Successfully edited reshare!");
      } else {
        toast.error("failed to update reshare!");
      }
    })
    setShowEdit(false);
    setContent("");
  }

  return (
    <>
      <button className={`${className}`} onClick={() => setShowEdit(true)}>
        Edit
      </button>
      <Modal open={showEdit} close={() => setShowEdit(false)} className="px-6 py-2 bg-white bg-opacity-40 backdrop-blur-[10px] max-w-[95%] h-[200px] w-[400px] shadow-xl py-10 pt-[40px] " twHeight="h-[500px]" twWidth="w-[90%] max-w-[400px]">
        <div>
          <p className="text-[#000] font-bold">
            Edit Reshare:
            <PostDisplay {...post} />
          </p>
        </div>
        <Form onFinish={editPostContent} className="mt-4">
          <NormalInput type="textarea" twHeight="h-auto" name="content" label="Content" placeholder="Content" value={content} onChange={({ target: { value } }) => {
            setContent(value);
          }} />
          <Button text="Edit" type="submit" loading={isEditing} disabled={isEditing} />
        </Form>
      </Modal>
    </>
  )
}

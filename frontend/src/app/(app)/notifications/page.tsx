"use client";
import PageContainer from "@/app/_components/general/page-container";
import PostDisplay from "@/app/_components/post-display";
import { useGetUserPostQuery } from "@/app/_lib/api/post";
import { Post } from "@/app/_lib/type";
import Empty from "@/app/_components/empty";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";
import { useGetNotificationsQuery, useLazyGetNotificationsQuery, useMarkNotificationAsReadMutation } from "@/app/_lib/api/notification";
import avater from "@/assets/icons/avatar.png";
import Image, { StaticImageData } from "next/image";
import { Notification } from "@/app/_lib/type";
import praiseIcon from "@/assets/icons/praised.png";
import commentIcon from "@/assets/icons/comment.svg";
import followIcon from "@/assets/icons/follow.png";
import notificationIcon from "@/assets/icons/notification.svg";
import reshareIcon from "@/assets/icons/reposted.png";
import { useGetPostQuery } from "@/app/_lib/api/post";
import { Skeleton } from "antd";
import { useGetCommentQuery } from "@/app/_lib/api/comment";
import { CommentDisplay } from "@/app/_components/post-comments";
import InfiniteScroll from "@/app/_components/infinite-scroll";
import { loadMoreItems } from "@/app/_lib/services";
import InView from "@/app/_components/in-view";
import { useState } from "react";

export default function Drafts() {
  const { data, isLoading } = useGetNotificationsQuery({
    limit: 8,
    page: 1,
  });
  const [getNotifications, { isLoading: isLoadingMore }] = useLazyGetNotificationsQuery();


  const notifications = data?.data || [];

  return (
    <PageContainer title="Notifications" loading={isLoading}>
      <InfiniteScroll
        limit={8}
        isLoading={isLoading || isLoadingMore}
        error={false}
        storageKey={"connect-users"}
        loadMore={(page) => loadMoreItems(page, getNotifications, 8)}
        initialData={notifications}
        hasMore={data?.length === 8}
        Element={NotificationDisplay}
      />
    </PageContainer >
  )
}

const icons: {
  follow: StaticImageData;
  praise: StaticImageData;
  comment: StaticImageData;
  tip?: StaticImageData;
  subscription?: StaticImageData;
  paywall?: StaticImageData;
  milestone?: StaticImageData;
  post?: StaticImageData;
  reply?: StaticImageData;
  reshare?: StaticImageData;
} = {
  follow: followIcon,
  praise: praiseIcon,
  comment: commentIcon,
  reshare: reshareIcon,
}

const NotificationDisplay = ({ ...notification }: Notification) => {
  const [readNotification] = useMarkNotificationAsReadMutation();
  const { _id, unread, type } = notification;
  const [read, setRead] = useState(!unread);
  const handleRead = () => {
    readNotification(_id).then(() => {
      setRead(true);
    });
  }


  return (
    <div className={`grid grid-cols-[40px_1fr] gap-2 mb-6 pb-2 border-b border-gray-200 relative ${!read ? '!bg-[#09123515]' : ''}`}>
      <div className="relative w-[30px] h-[30px] overflow-hidden">
        <Image src={icons[type] || notificationIcon} alt="notificationIcon" fill objectFit="contain" objectPosition="center" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden rounded-full">
            <Image
              src={notification.notificationOriginDetails?.profilePhoto || avater}
              alt="profile"
              fill
              objectFit="cover"
              objectPosition="center"

            />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium">
              {notification.notificationOriginDetails?.firstName} {notification.notificationOriginDetails?.lastName}
            </div>
            <div className="text-xs text-gray-500">
              {notification.notificationOriginDetails?.username}
            </div>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-500 ">
          {notification.content}
        </div>
        {
          notification.metadata ? (
            <>
              {notification.metadata.postId && <DisplayPostNotification id={notification.metadata.postId} />}
              {notification.metadata.commentId && <DisplayCommentNotification id={notification.metadata.commentId} />}
            </>
          ) : null
        }
      </div>
      {
        !read &&
        <InView action={handleRead}><div></div></InView>
      }
    </div>
  )
}

const DisplayCommentNotification = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetCommentQuery(id);

  const comment = data?.data;

  if (isLoading)
    return <Skeleton />
  return (
    <div className="border p-2 rounded-lg">
      <CommentDisplay hideReactions {...comment} />
    </div>
  )
}
const DisplayPostNotification = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetPostQuery(id);

  const post = data?.data;
  if (isLoading)
    return <Skeleton />
  return (
    <div className="border p-2 rounded-lg">
      <PostDisplay {...post} hideReaction />
    </div>
  )
}
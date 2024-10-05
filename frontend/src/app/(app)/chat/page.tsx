"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import ListUsers from "@/app/_components/list-users";
import { useGetFollowingQuery, useLazyGetFollowingQuery } from "@/app/_lib/api/user";
import { ROUTES } from "@/app/_lib/routes";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { User } from "@/app/_lib/type";
import e from "express";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import avatar from "@/assets/icons/avatar.png";
import dayjs from "dayjs";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL).connect();

export default function Chat() {
  const { info } = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(true);
  const [messagesList, setMessagesList] = useState<any[]>([]);

  const { data: followingsData, isLoading: followingsDataLoading } = useGetFollowingQuery({});
  const [getFollowing, { isLoading: isFetchingFollowing }] = useLazyGetFollowingQuery();


  useEffect(() => {
    console.log(info)
    if (info) {
      socket.emit("view_chat_list", info?._id || "");
      socket.on("chat_list", (data) => {
        console.log(data);
        setLoading(false);
        if (Array.isArray(data) && data.length > 0)
          setMessagesList(data)
      })
    }
  }, [info])
  return (
    <PageContainer title="Chat" loading={loading}>
      <div>
        {
          messagesList.length === 0 ? (
            <div>
              <div className="flex flex-col items-center">
                <h3 className="text-[#000a]">No existing chat</h3>
                <p className="mb-4 text-center text-gray-400 italic font-light">Start chats with accounts you are connected to:</p>
                <div className="xs:min-w-[300px]">
                  {followingsData?.data?.length > 0 ? <div className="flex flex-col gap-4">
                    <ListUsers users={followingsData?.data || []} query={{
                      following: info?._id
                    }} showChat={true} showFollow={false} />
                  </div> : (
                    <div className="min-w-full flex flex-col items-center">
                      <h4>No accounts to chat with</h4>
                      <Link href={ROUTES.connect} className="underline font-medium text-[#22bb99]">Connect with accounts</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {
                messagesList.map((message, i) => (
                  <MessageDisplay key={i} {...({ ...message, userId: info?._id || info?.id })} />
                ))
              }
            </div>
          )
        }
      </div>
    </PageContainer>
  )
}

export interface Message {
  senderId: string;
  _id?: string;
  receiverId: string;
  sender: User;
  receiver: User;
  message: string;
  time: string,
  userId: string;
  sentAt: Date;
  read: boolean;
}
const MessageDisplay: React.FC<Message> = ({ sender, receiver, message, time, read, senderId, userId, sentAt }) => {
  const lastMessageIsFromUser = senderId === userId;
  const otherUser = lastMessageIsFromUser ? receiver : sender;
  const formatTimeSent = sentAt ? dayjs(sentAt).format("MMM DD; HH:mm") : "";

  return (
    <div className="grid grid-cols-[40px_1fr] gap-2 relative">
      <Link href={ROUTES.accountId.replace(":id", otherUser._id as string)} className="relative w-[40px] h-[40px] nin-w-[40px]  rounded-full overflow-hidden">
        <Image src={otherUser?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
      </Link>
      <div className="min-w-full">
        <div className="flex gap-1 min-w-full">
          <p className="font-medium text-[12px] sm:text-[14px] sm:text-[16px] w-full overflow-hidden text-ellipsis whitespace-nowrap">{otherUser?.firstName} {otherUser?.lastName}<span className="text-[#373737aa] ml-1">@{otherUser?.username}</span></p>
          <p className="text-[10px] sm:text-[12px] text-[#373737aa] italic w-[60px] whitespace-nowrap">{formatTimeSent}</p>
        </div>
        <Link href={ROUTES.chatId.replace(":id", otherUser._id as string)} className="flex items-center gap-2 relative">
          <p dangerouslySetInnerHTML={{ __html: message }} className={`text-[12px] sm:text-[14px] sm:text-[16px] max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap  ${read ? "text-gray-300 italic" : "font-bold"}`} />
        </Link>
      </div>
    </div>
  )
}
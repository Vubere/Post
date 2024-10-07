"use client";
import ChatEditor from "@/app/_components/chat-editor";
import PageContainer from "@/app/_components/general/page-container";
import { useGetUserQuery } from "@/app/_lib/api/user";
import { useAppSelector } from "@/app/_lib/store/hooks";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";
import avatar from "@/assets/icons/avatar.png";
import { Message } from "../";
import InView from "@/app/_components/in-view";
import messageRead from "@/assets/icons/message-read.png";
import messageSent from "@/assets/icons/message-sent.png";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import { Skeleton } from "antd";


let socket = io(process.env.NEXT_PUBLIC_SOCKET_URL).connect();

export default function Chat() {
  const { info } = useAppSelector(state => state.user);
  const { id } = useParams<{ id: string }>();
  const { data: userData, isLoading: userDataLoading } = useGetUserQuery(id);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const otherUserInfo = userData?.data;
  const chatId = useMemo(() => otherUserInfo && info ? [otherUserInfo?._id || otherUserInfo?.id, info?._id || info?.id].sort().join("-") : "", [otherUserInfo, info]);
  const [loading, setLoading] = useState(true);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [chat, setChat] = useState("");

  const sendMessage = async (chat: string) => {
    if (chat === "") return;
    const messageData = {
      chatId: chatId,
      message: chat,
      senderId: info?._id || info?.id,
      receiverId: otherUserInfo?._id || otherUserInfo?.id,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds(),
    }
    socket.emit("send_message", messageData);
    setChat("");
  };

  useEffect(() => {
    socket.on("receive_message", async (data) => {
      setMessagesList((prev) => [...prev, data]);
    });
  }, []);

  useEffect(() => {
    if (chatId) {
      socket.emit("enter_chat", { chatId, userId: info?._id || info?.id });
      socket.on("chats", (data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMessagesList(data);
        }
        setLoading(false);
      });
    }
  }, [chatId]);
  const messagesLength = messagesList.length;
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesLength]);

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-2">
        <Skeleton />
        <Skeleton />
      </div>
    )
  }
  return (
    <div className=" relative overflow-hidden text-black">
      <div className="h-[calc(100vh-150px)] overflow-y-auto w-full overflow-y-auto pb-[60px] max-h-[calc(100%-150px)] pt-[40px] xs:px-[5px] sm:px-[10px]">

        <Link href={ROUTES.accountId.replace(":id", otherUserInfo?._id || "")} className="mb-4">
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="relative w-[40px] h-[40px]  rounded-full overflow-hidden">

              <Image src={otherUserInfo?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
            </div>
            <div className="flex flex-col items-center">
              <p className="font-medium text-[14px] sm:text-[16px]">{otherUserInfo?.firstName} {otherUserInfo?.lastName}</p>
              <p className="text-[8px] sm:text-[11px] text-[#373737aa] italic">@{otherUserInfo?.username}</p>
            </div>
          </div>
        </Link>
        {
          messagesList.length === 0 ? (
            <div className="flex flex-col items-center">
              <h3 className="text-[#000a]">No existing chat</h3>
              <p className="mb-4 text-center text-gray-400 italic font-light">Send a message to start chat with {otherUserInfo?.username}</p>

            </div>
          ) : (
            <div className="flex flex-col mb-[60px]">
              {
                messagesList.map((message, i) => (
                  <MessageDisplay key={i} {...({ ...message, userId: info?._id || info?.id, chatId })} />
                ))
              }
              <div ref={scrollRef}></div>
            </div>
          )
        }
      </div>
      <ChatEditor sendMessage={sendMessage} chatId={chatId} user={info} otherUser={otherUserInfo} chat={chat} setChat={setChat} />
    </div>
  )
}

const MessageDisplay: React.FC<Message & { chatId: string }> = ({ message, read, senderId, userId, sentAt, _id, chatId }) => {
  const isUserMessage = senderId === userId;
  const formatTimeSent = sentAt ? dayjs(sentAt).format("MMM DD; HH:mm") : "";
  const [isRead, setIsRead] = useState(read);

  const handleRead = () => {
    socket.emit("message_read", { id: _id, userId, chatId });
    setIsRead(true);
  }

  return (
    <div className={`flex ${isUserMessage ? "justify-end rounded-l-lg  " : "justify-start  text-white "} p-2 `}>
      <div className={`${isUserMessage ? "items-end bg-white text-gray-500 rounded-l-lg  " : "items-start bg-blue-300 rounded-r-lg  text-white "} rounded-b-lg shadow-xl  flex w-[300px] max-w-[80%] flex-col  p-2 py-1 `}>
        <p dangerouslySetInnerHTML={{ __html: message }} className={`text-[14px] sm:text-[16px] min-w-full`} />
        <div className="min-w-full flex justify-between items-center">
          {isUserMessage && <span className="block relative w-[14px] h-[14px]">
            {
              isRead ?
                <Image src={messageRead} alt="" objectFit="contain" objectPosition="center" fill />
                :
                <Image src={messageSent} alt="" objectFit="contain" objectPosition="center" fill />
            }
          </span>}
          <span className="text-[10px] sm:text-[12px] text-[#373737aa] italic w-[60px] whitespace-nowrap">{formatTimeSent}</span>
        </div>
      </div>
      {
        !isRead && !isUserMessage ?
          <InView action={handleRead} />
          : null
      }
    </div>
  )
}
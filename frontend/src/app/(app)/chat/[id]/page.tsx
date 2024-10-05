"use client";
import ChatEditor from "@/app/_components/chat-editor";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import ListUsers from "@/app/_components/list-users";
import { useGetFollowingQuery, useGetUserQuery, useLazyGetFollowingQuery } from "@/app/_lib/api/user";
import { ROUTES } from "@/app/_lib/routes";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { User } from "@/app/_lib/type";
import e from "express";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL).connect();

export default function Chat() {
  const { info } = useAppSelector(state => state.user);
  const { id } = useParams<{ id: string }>();
  const { data: userData, isLoading: userDataLoading } = useGetUserQuery(id);
  const otherUserInfo = userData?.data;
  const chatId = useMemo(() => otherUserInfo && info ? `${otherUserInfo?._id || otherUserInfo?.id}-${info?._id || info?.id}` : "", [otherUserInfo, info]);
  const [loading, setLoading] = useState(true);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [chat, setChat] = useState("");
  const [form, setForm] = useState({
    name: "",
    roomId: "",
    chat: "",
  });
  const [messages, setMessages] = useState<any[]>([]);
  const handleChange = (e: any) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (form.roomId === "" && form.name === "") return
    socket.emit("join_room", form.roomId);

  };
  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (form.chat === "") return;
    const messageData = {
      room: form.roomId,
      message: form.chat,
      user: form.name,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds()
    }
    await socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setForm((prev) => ({ ...prev, chat: "" }));
  };

  useEffect(() => {
    socket.on("receive_message", async (data) => {
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });
  }, []);
  useEffect(() => {
    if (chatId) {
      socket.emit("enter_chat", { chatId, userId: info?._id || info?.id });
      socket.on("chats", (data) => {
        console.log("chats", data);
        setMessagesList(data);
        setLoading(false);
      });
    }
  }, [chatId]);

  return (
    <PageContainer loading={loading}>
      {
        messagesList.length === 0 ? (
          <div className="flex flex-col items-center">
            <h3>No existing chat</h3>
            <p className="mb-4">Send a message to start chat with {info?.username}</p>

          </div>
        ) : (
          <div className="flex flex-col gap-4">
          </div>
        )
      }
      <ChatEditor chatId={chatId} user={info} otherUser={otherUserInfo} chat={chat} chatOnChange={setChat} />
    </PageContainer>
  )
}

const ChatComponent = ({ chatId, user, otherUser }: { chatId: string, user: User, otherUser: User }) => {
  const [showFormats, setShowFormats] = useState(false);
  return (
    <div>
      {/* blur state */}
      <div className="flex gap-2">
        <div>

          {!showFormats ? (
            <>
              <div className="addImage"></div>
              <div className="hidden">
                <div className="formats">
                  <div className="format"></div>
                </div>
              </div>
            </>
          ) : (
            <div>
            </div>)}
          <div className="send hidden">

          </div>
        </div>
        <div className="input"></div>
      </div>
    </div>
  )
}


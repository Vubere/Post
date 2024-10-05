"use client";
import Empty from "@/app/_components/empty";
import PageContainer from "@/app/_components/general/page-container";
import ListUsers from "@/app/_components/list-users";
import { useGetFollowingQuery, useLazyGetFollowingQuery } from "@/app/_lib/api/user";
import { ROUTES } from "@/app/_lib/routes";
import { useAppSelector } from "@/app/_lib/store/hooks";
import e from "express";
import Link from "next/link";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL).connect();

export default function Chat() {
  const { info } = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(true);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    roomId: "",
    chat: "",
  });
  const { data: followingsData, isLoading: followingsDataLoading } = useGetFollowingQuery({});
  const [getFollowing, { isLoading: isFetchingFollowing }] = useLazyGetFollowingQuery();
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
    console.log(info)
    if (info) {
      socket.emit("view_chat_list", info?._id || "");
      socket.on("chat_list", (data) => {
        console.log(data);
        setLoading(false);
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
                <h3>No existing chat</h3>
                <p className="mb-4">Start chats with accounts you are connected to:</p>
                <div className="xs:min-w-[300px]">
                  {followingsData?.data?.length > 0 ? <div className="flex flex-col gap-4">
                    <ListUsers users={followingsData?.data || []} query={{
                      following: info?._id
                    }} />
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
            <div className="flex flex-col gap-4">
            </div>
          )
        }
      </div>
    </PageContainer>
  )
}
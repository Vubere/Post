"use client";
import { MouseEventHandler, ReactNode } from "react";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { useFollowUserMutation, useSubscribeMutation, useUnfollowUserMutation, useUnsubscribeMutation } from "@/app/_lib/api/user";
import { User } from "@/app/_lib/type";
import { useEffect, useMemo, useState } from "react";
import useGetAndUpdateProfile from "@/app/_lib/hooks/use-get-and-update-profile";
import followIcon from "@/assets/icons/follow.png";
import followedIcon from "@/assets/icons/followed.png";
import subscribeIcon from "@/assets/icons/subscribe.png";
import subscribedIcon from "@/assets/icons/subscribed.png";
import Image from "next/image";
import { Modal } from "antd";

interface Props {
  className?: string;
  text?: string;
  children?: ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  theme?: "dark" | "light" | "danger";
  adjustSize?: "medium" | "small"
}

export default function Button(props: Props) {
  return (
    <button className={`disabled:bg-[#0004] bg-[#0009] hover:bg-[#000d] text-white w-full h-[35px] text-[17px] uppercase font-medium [&.light]:bg-[#fff9] [&.light]:text-black [&.light]:border [&.light]:border-1 [&.light]:border-[#0009] [&.light]:disabled:bg-[#0002] [&.danger]:bg-[#f66] [&.danger]:text-white [&.danger]:border [&.danger]:border-1 [&.danger]:border-[#fff1] [&.danger]:disabled:bg-[#f66b] [&.medium]:text-[14px] [&.medium]:h-[24px] [&.small]:text-[11px] [&.small]:h-[18px] ${props.adjustSize ?? ""} ${props.theme ?? ""}  ${props.className ?? ""}`} type={props.type || "submit"} disabled={props.disabled} onClick={props?.onClick}>
      {props.children || props.text}
      {props.loading && <span className={`text-white text-[32px] [&.medium]:text-[24px] [&.small]:text-[18px] leading-[16px] h-full pr-2 animate-ping ${props.theme === "light" ? "!text-[#000]" : ""} ${props.adjustSize ?? ""}`}>...</span>}
    </button>
  )
}

export function FollowButton({ user }: { user: User }) {
  const { info } = useAppSelector((state) => state.user);
  const userId = (info?._id || info?.id) as string;
  const connectId = (user?._id || user?.id) as string;
  const { getProfile } = useGetAndUpdateProfile();
  const isFollowing = !!user.followers?.includes(userId);
  const [followingBool, setIsFollowingBool] = useState(isFollowing);
  const [follow, { isLoading: followingProcessing }] = useFollowUserMutation();
  const [unfollow, { isLoading: unfollowingProcessing }] = useUnfollowUserMutation();

  useEffect(() => {
    setIsFollowingBool(isFollowing);
  }, [isFollowing])

  const toggleFollow = () => {
    if (followingBool) {
      unfollow(connectId).then((res) => {
        const data = res?.data as any;
        if (data?.status === "success") {
          setIsFollowingBool(false);
          getProfile();
        }
      })
    } else {
      follow(connectId).then((res) => {
        const data = res?.data as any;
        if (data?.status === "success") {
          setIsFollowingBool(true);
          getProfile();
        }
      })
    }
  }

  return (
    <button className="!transparent relative min-w-[30px] w-[25px] h-[25px] pb-4" onClick={toggleFollow} disabled={followingProcessing || unfollowingProcessing}>
      <Image src={followingBool ? followedIcon : followIcon} alt="follow" title={followingBool ? "unfollow" : "follow"} fill objectPosition="center" objectFit="contain" />
    </button>
  )
}

export function SubscribeButton({ user }: { user: User }) {
  const { info } = useAppSelector((state) => state.user);
  const userId = (info?._id || info?.id) as string;
  const connectId = (user?._id || user?.id) as string;
  const { getProfile } = useGetAndUpdateProfile();
  const isSubscribed = !!user.followers?.includes(userId);
  const [subscribedBool, setIsSubscride] = useState(isSubscribed);
  const [subscribe, { isLoading: subscribeProcessing }] = useSubscribeMutation();
  const [unsubscribe, { isLoading: unsubscribeProcessing }] = useUnsubscribeMutation();

  useEffect(() => {
    setIsSubscride(isSubscribed);
  }, [isSubscribed])

  const toggleSubscribe = () => {
    if (subscribedBool) {
      Modal.confirm({
        onOk: () => unsubscribe(connectId).then((res) => {
          const data = res?.data as any;
          if (data?.status === "success") {
            setIsSubscride(false);
            getProfile();
          }
        }),
        title: "Are you sure you want to unsubscribe? you would lose the subscription money your have already paid!",
        okText: "Unsubscribe"
      })
    } else {

      Modal.confirm({
        onOk: () => subscribe(connectId).then((res) => {
          const data = res?.data as any;
          if (data?.status === "success") {
            setIsSubscride(true);
            getProfile();
          }
        }),
        title: `Subscribe to ${user?.username} for subscription fee of ${user.subscriptionFee}?`,
        okText: "Subscribe"
      })
    }
  }
  const confirm = () => {

  }

  return (
    <>
      <button className="!transparent relative min-w-[30px] w-[25px] h-[25px] pb-4" onClick={toggleSubscribe} disabled={subscribeProcessing || unsubscribeProcessing}>
        <Image src={subscribedBool ? subscribedIcon : subscribeIcon} alt="subscribe" title={subscribedBool ? "unsubscribe" : "subscribe"} fill objectPosition="center" objectFit="contain" />
      </button>
    </>
  )
}
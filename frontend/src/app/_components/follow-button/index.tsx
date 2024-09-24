"use client";
import Button from "@/app/_components/general/button";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { useFollowUserMutation, useUnfollowUserMutation } from "@/app/_lib/api/user";
import { User } from "@/app/_lib/type";
import { useEffect, useMemo, useState } from "react";
import useGetAndUpdateProfile from "@/app/_lib/hooks/use-get-and-update-profile";

export default function FollowButton({ user }: { user: User }) {
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
    <Button text={followingBool ? "unfollow" : "follow"} className="lowercase max-w-[80px] min-w-[80px] pb-4" theme={followingBool ? "light" : "dark"} adjustSize="medium" onClick={toggleFollow} loading={followingProcessing || unfollowingProcessing} disabled={followingProcessing || unfollowingProcessing} />
  )
}
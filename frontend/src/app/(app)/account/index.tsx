"use client";
import avatar from "@/assets/icons/avatar.png";
import editIcon from "@/assets/icons/edit.png";
import PageContainer from "@/app/_components/general/page-container";
import { useAppSelector } from "@/app/_lib/store/hooks";
import Image from "next/image";
import { RootState } from "@/app/_lib/store";
import Button, { SubscribeButton, FollowButton } from "@/app/_components/general/button";
import Tab from "@/app/_components/tab";
import { useGetAllPostsQuery, useGetPraiseQuery, useGetUserPostQuery, useLazyGetPraiseQuery, useLazyGetUserPostQuery } from "@/app/_lib/api/post";
import { useMemo } from "react";
import PostDisplay from "@/app/_components/post-display";
import { Post, User } from "@/app/_lib/type";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import { SECTION_CLASSNAME } from "@/app/_lib/utils/constants";
import InfiniteScroll from "@/app/_components/infinite-scroll";
import { loadMoreItems } from "@/app/_lib/services";
import Empty from "@/app/_components/empty";
import chatIcon from "@/assets/icons/dashboard/chat.png"


export default function Account({ userInfo }: { userInfo: User }) {
  const { info } = useAppSelector(state => state.user);

  const isUserAccount = info?._id === userInfo?._id;
  const { data: userPost, isLoading: userPostLoading, refetch } = useGetUserPostQuery({
    userId: userInfo._id || userInfo.id
  });
  const { data: praisedPost, isLoading: praisedPostLoading, refetch: refetchPraise } = useGetPraiseQuery({
    userId: userInfo._id || userInfo.id
  });
  const subscriptionFeeSet = Number(userInfo?.subscriptionFee) > 0;

  const userPostArray = userPost?.data || [];
  const praisedPostArray = praisedPost?.data || [];

  const extraSections = userInfo?.profileSections;

  const Items = [
    {
      content: <UserPost userId={(userInfo._id || userInfo.id) as string} initialData={userPostArray} initialDataLoading={userPostLoading} refetch={refetch} />,
      title: "Posts", loading: userPostLoading
    },
    {
      content: <PraisedPost
        userId={(userInfo._id || userInfo.id) as string}
        initialData={praisedPostArray}
        initialDataLoading={praisedPostLoading}
        refetch={refetchPraise}
      />,
      title: "Praises", loading: praisedPostLoading
    },
  ]

  return (
    <PageContainer title="Account">
      <div className="flex flex-col gap-4">
        <section className={SECTION_CLASSNAME}>
          <div className="flex justify-between items-end relative">

            <div className="flex items-center gap-2 relative mb-2 px-2">
              <div className="relative w-[80px] h-[80px] min-w-[80px]  rounded-full overflow-hidden">
                <Image src={userInfo?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
              </div>
              <div>
                <p className="font-medium text-[14px] sm:text-[16px]">{userInfo?.firstName} {userInfo?.lastName}</p>
                <p className="text-[12px] sm:text-[14px] text-[#373737aa] italic">@{userInfo?.username}</p>
              </div>
            </div>
            {isUserAccount ? (<div className="absolute right-2 top-2 xs:top-3 sm:top-4 z-[4]" title="edit">
              <Link href={ROUTES.accountEdit} className="relative block rounded-full !w-[20px] !h-[20px] !border-none !bg-transparent cursor-pointer" >
                <Image src={editIcon} alt="edit" objectFit="cover" objectPosition="center" fill />
              </Link>
            </div>) : (<div className="absolute right-2 top-4 xs:top-6 sm:top-8 z-[4]" >

              <div className="w-full flex gap-2 justify-end ">
                <Link className="block relative w-[25px] h-[25px]" href={ROUTES.chatId.replace(":id", (userInfo._id || userInfo.id) as string)} title="chat">
                  <Image
                    src={chatIcon} fill objectFit="contain" objectPosition="center" alt="chat" />
                </Link>
                {subscriptionFeeSet && <SubscribeButton user={userInfo} />}
                <FollowButton user={userInfo} />
              </div>

            </div>)}
          </div>
          <ul className="gap-1 flex pr-2 justify-end flex text-[12px] italics sm:text-[14px]">
            <li>
              <Link href={ROUTES.followers.replace(":id", userInfo._id as string)}>
                {userInfo.followers?.length}&nbsp;Followers
              </Link>
            </li>
            <li>
              <Link href={ROUTES.following.replace(":id", userInfo._id as string)}>
                {userInfo.following?.length}&nbsp;Following
              </Link>
            </li>
          </ul>
          {userInfo?.biography && (
            <p className=" text-[#373737aa] px-2">{userInfo?.biography}</p>
          )}
        </section>

        {!!extraSections?.length && (
          <section className={`${SECTION_CLASSNAME} flex flex-col gap-4 px-2`}>
            {
              extraSections.map(({ name, content }: { name: string, content: string }) => (
                <article key={name} className="flex flex-col gap-1">
                  <h4 className="font-bold text-[14px] sm:text-[16px]">{name}</h4>
                  <p className="text-[11px] xs:text-[14px] sm:text-[16px] xs:text  text-[#373737aa]">{content}</p>
                </article>
              ))
            }
          </section>
        )}

        <Tab
          items={Items}
          loading={praisedPostLoading || userPostLoading}
        />

      </div>
    </PageContainer>
  )
}


function UserPost({ userId, initialData, initialDataLoading, refetch }: { userId: string, initialData: any[], initialDataLoading: boolean, refetch: () => any }) {
  const [getUserPosts, { isLoading: isLoadingPost, isFetching: isFetchingPost }] = useLazyGetUserPostQuery();
  const feedLoading = isLoadingPost || isFetchingPost || initialDataLoading;
  return (
    <>
      {
        initialData.length > 0 && <InfiniteScroll
          limit={10}
          isLoading={feedLoading}
          className="!gap-1"
          error={false}
          storageKey={"user-post"}
          loadMore={(page) => loadMoreItems(page, getUserPosts, 10, { userId })}
          initialData={initialData}
          hasMore={initialData?.length === 10}
          Element={PostDisplay}
          componentExtraProps={{ validate: refetch }}
        />}

      {(!initialData.length && !initialDataLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}>
          <Empty text="No Posts" />
        </div>
        : null
      }
    </>
  )
}
function PraisedPost({ userId, initialData, initialDataLoading, refetch }: { userId: string, initialData: any[], initialDataLoading: boolean, refetch: () => any }) {
  const [getPraise, { isLoading: praisedPostFetching, isFetching: praisedPostLoading }] = useLazyGetPraiseQuery();
  const praiseLoading = praisedPostFetching || praisedPostLoading || initialDataLoading;
  return (
    <>
      {
        initialData.length > 0 && <InfiniteScroll
          limit={10}
          isLoading={praiseLoading}
          className="!gap-1"
          error={false}
          storageKey={"user-post"}
          loadMore={(page) => loadMoreItems(page, getPraise, 10, { userId })}
          initialData={initialData}
          hasMore={initialData?.length === 10}
          Element={PostDisplay}
          componentExtraProps={{ validate: refetch }}
        />}

      {(!initialData.length && !initialDataLoading) ?
        <div className={"w-full" + SECTION_CLASSNAME}>
          <Empty text="No Praised Posts" />
        </div>
        : null
      }
    </>
  )
}
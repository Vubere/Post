"use client";
import { Post, User } from "@/app/_lib/type";
import Image from "next/image";
import { Familjen_Grotesk, Jacques_Francois, Merriweather as Mw, Roboto as Rb, Bree_Serif } from "next/font/google";
import { TYPE_CLASSNAME } from "@/app/_lib/utils/constants";
import PostDisplay from "../post-display";
import ReadDetect from "./readDetector";
import { useMemo, useRef } from "react";
import { startCase } from "lodash";
import { paywallCheck } from "@/app/_lib/services";
import PayPaywall from "./pay-paywall";

const Default = Familjen_Grotesk({
  weight: ["400", "400", "700"],
  subsets: ["latin"]
});
const Jacques = Jacques_Francois({
  weight: ["400"],
  subsets: ["latin"]
})
const Roboto = Rb({
  weight: ["400", "400", "500", "700"],
  subsets: ["latin"]
});
const BreeSerif = Bree_Serif({
  weight: ["400"],
  subsets: ["latin"]
});
const Merriweather = Mw({
  weight: ["400", "700", "900"],
  subsets: ["latin"]
});
const themes = {
  Merriweather,
  BreeSerif,
  Roboto,
  Jacques,
  Default
}



export default function PostPage({ post, user }: { post: Post, user: Partial<User> }) {
  const { content, coverPhoto, authorDetails, author, type, title, theme, reads, id, _id } = post;
  const au = (authorDetails?.firstName ? authorDetails : author) as unknown as User;
  const ref = useRef<HTMLDivElement | null>(null)
  const shouldPaywall = useMemo(() => paywallCheck({ user: user as User, post }), [user, post]);
  const themeClassName = theme && themes[theme] ? themes[theme].className : themes["Default"].className;

  return (
    <>
      {post?.postType !== "reshare" ?
        (shouldPaywall ? null :
          <div className={`${themeClassName} w-full h-auto bg-transparent`} ref={ref}>
            {coverPhoto && <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden relative rounded-[30px] mb-[15px]">
              <Image src={coverPhoto} alt={title ?? ""} fill objectFit="cover" objectPosition="center" />
            </div>}
            <div className="mb-[20px]">
              <h1 className="text-black leading-[105%] font-bold text-[24px] xs:text-[32px] sm:text-[42px] md:text-[48px] lg:text-[54px]">{title}</h1>
              {type && <div className={`font-light rounded-full px-2 py-1 text-[11px] sm:text-[14px] w-auto inline-block my-2 ${TYPE_CLASSNAME[startCase(type || "") as keyof typeof TYPE_CLASSNAME]}`}>
                {startCase(type || "")}
              </div>}
              <p className="text-[#3d3d3d] text-[11px] xs:text-[14px] sm:text-[16px] md:text-[22px] italic ">- {au?.firstName ? `${au.firstName || ""} ${au.lastName || ""}` : "author"}</p>
            </div>


            {shouldPaywall ? (
              <div>
                <p>{post?.synopsis}</p>
                <p className="mt-3">Paywalled: you have to pay {post.paywallFee} collects to get access</p>
                <PayPaywall id={(post._id || post.id) as string} paywallFee={post?.paywallFee as string} />
              </div>
            ) : <div className="[&_p]:text-grey-400 [&_p]:text-[12px] xs:[&_p]:text-[14px] sm:[&_p]:text-[16px] [&_a]:text-[#44f] [&_a]:underline" dangerouslySetInnerHTML={{ __html: (content ?? "").replace(/&lt;/g, "<") }} />}
            {!shouldPaywall && <ReadDetect reads={reads as string[]} id={(id || _id) as string} />}

          </div>) : (
          <div ref={ref}>

            <PostDisplay isAuthorPost={false} hideReaction shadow={false} {...(post as Post)} />
            <ReadDetect reads={reads as string[]} id={(id || _id) as string} />
          </div>
        )}
    </>
  )
}
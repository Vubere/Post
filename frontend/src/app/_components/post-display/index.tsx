import { Post } from "@/app/_lib/type";
import Image from "next/image";
import avatar from "@/assets/icons/avatar.png";
import Button from "../general/button";
import editIcon from "@/assets/icons/dot-menu.png";
import views from "@/assets/icons/views.svg";
import praise from "@/assets/icons/praise.png";
import repost from "@/assets/icons/repost.png";
import comment from "@/assets/icons/comment.svg";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";

interface PostDisplay extends Post {
  isAuthorPost: boolean;
  className?: string
}

export default function PostDisplay(props: PostDisplay) {

  return (
    <article className={props?.className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 relative">

          <div className="relative w-[40px] h-[40px]  rounded-full overflow-hidden">
            <Image src={props?.authorDetails?.profilePhoto || avatar} alt="" objectFit="cover" objectPosition="center" fill />
          </div>
          <div>
            <p className="font-medium text-[14px] sm:text-[16px]"> {props?.authorDetails?.firstName} {props?.authorDetails?.lastName}</p>
            <p className="text-[8px] sm:text-[11px] text-[#373737aa] italic">@{props?.authorDetails?.username}</p>
          </div>
        </div>

        {props.isAuthorPost && <div className="" title="options">
          <Button className="relative rounded-full !w-[20px] !h-[40px] !border-none !bg-transparent" theme="light">
            <Image src={editIcon} alt="" fill objectFit="contain" objectPosition="center" />
          </Button>
        </div>}
      </div>
      <div className="flex flex-col gap-1">
        {props?.coverPhoto && <div className="relative w-full rounded-[8px] h-[200px] overflow-hidden mb-2 sm:mb-4">
          <Image src={props?.coverPhoto} alt={props?.title} fill objectFit="cover" objectPosition="center" />
        </div>}
        <h2 className="text-[24px] xs:text-[28px] lg:text-[34px] font-bold leading-[110%]">{props?.title}</h2>
        <p className="text-[12px] xs:text-[14px] sm:text-[16px] md:text-[18px] text-[#373737aa]">{props?.synopsis}</p>

        <Link href={ROUTES.post + `/${props.id}`} className="underline font-medium italic text-[#22bb99]">Read</Link>

      </div>

      <ul className="flex justify-around px-4 mt-4">
        {[
          {
            icon: comment,
            number: props?.comments?.length || 0,
            onClick: () => { }
          },
          {
            icon: views,
            number: props?.views?.length || 0,
            onClick: () => { }
          },
          {
            icon: praise,
            number: props?.praises?.length || 0,
            onClick: () => { }
          },
          {
            icon: repost,
            number: props?.resharedBy?.length || 0,
            onClick: () => { }
          },
        ].map(({ icon, number, onClick }) => (<li className="flex flex-col items-center">
          <div className="relative w-[20px] h-[20px]" onClick={onClick}>
            <Image src={icon} alt="" fill objectFit="contain" objectPosition="center" />
          </div>
          <span className="text-[12px] text-[#373737]">{number}</span>
        </li>))}
      </ul>

    </article>
  )
}

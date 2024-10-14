import heroImage from "@/assets/backgrounds/hero.png";
import Image from "next/image";
import PostDisplay from "../_components/post-display/open-display";
import { Post, User } from "../_lib/type";
import avatar from "@/assets/icons/avatar.png";

/* custom components */
import Footer from "@/app/_components/footer"
import BackgroundImg from "@/app/_components/image-in-background";
import Button, { BlueButton } from "@/app/_components/general/button";

/* assets */
import hero from "@/assets/images/hero.png"
import about from "@/assets/images/about.png"
import avatar1 from "@/assets/images/avatarReviewer.png"
import avatarR from "@/assets/images/avatarRight.png"
import avatarL from "@/assets/images/avatarBottomLeft.png"
import avatarLt from "@/assets/images/avatarTopLeft.png"

/* icons */
import analysisIcon from "@/assets/icons/analytics.svg"
import peopleIcon from "@/assets/icons/people.svg"
import documentIcon from "@/assets/icons/document.svg"
import Link from "next/link";
import { ROUTES } from "../_lib/routes";





async function getTopUsers() {
  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/open/top-users`).then(res => res.json());
    return { data: res?.data, status: "success" };

  } catch (error) {
    return ({
      error,
      status: "failed",
    });
  }
}
async function getTopPost() {
  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/open/top-post`).then(res => res.json());
    return { data: res?.data, status: "success" };

  } catch (error) {
    console.log(error);
    return ({
      error,
      status: "failed",
    });
  }
}

export default async function Home() {
  const topUsersData = await getTopUsers();
  const topPostData = await getTopPost();
  const topUsers: User[] = topUsersData?.status === "success" ? topUsersData?.data?.map((item: any) => item.authorDetails) : [];
  const topPost: Post[] = topPostData?.status === "success" ? topPostData?.data : [];

  return (
    <div className="flex min-h-screen flex-col items-center justify-between  w-full">
      <Hero />
      <About />
      <section className="bg-white w-full p-4 text-black mb-[40px] my-[50px]">
        <h3 id="about" className="w-full text-center font-bold text-[21px] md:text-[24px] lg:text-[32px]">Top Active Members</h3>
        <ul className="flex overflow-y-hidden overflow-x-auto gap-[10px] sm:gap-[20px] py-4">
          {
            topUsers.map((item, i) => {

              const bioTruncate = item.biography && item.biography.length > 100 ? item.biography.slice(0, 47) + "..." : item.biography;

              return (
                <li key={i} className="block max-w-full max-w-[90vw] w-[200px] min-w-[200px]  sm:w-[240px] sm:w-[240px] sm:min-w-[240px] md:w-[280px] md:min-w-[280px]  ">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-full h-[200px] sm:h-[240px] md:h-[280px] m-2 overflow-hidden ">
                      <Image
                        alt={item.firstName}
                        src={item.profilePhoto || avatar}
                        fill
                        sizes="(max-width: 768px) 100vw, 120px"
                        objectFit="cover" />
                    </div>
                    <div className="w-full">
                      <h4 className="font-bold max-w-full w-full text-[14px] sm:text-[16px] md:text-[18px] lg:text-[21px] leading-[118%] whitespace-nowrap truncate ">
                        {`${item.firstName || ""} ${item.lastName || ""}`}
                      </h4>
                      <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] leading-[103%] font-thin italic truncate">@{item.username}</p>
                    </div>
                    <p className={` text-[#000a] w-full text-[12px] sm:text-[14px] text-wrap word-wrap leading-[105%] mt-2`}>{bioTruncate}</p>
                  </div>

                </li>
              )
            })
          }

        </ul>
      </section>

      <Reviews />
      <WhyJoin />
      <Expo />
      <section className="bg-white w-full p-4 text-black mb-[40px]">
        <h3 id="top-post" className="w-full text-center font-bold text-[21px] md:text-[24px] lg:text-[32px]">Top Posts</h3>
        <ul className="flex overflow-y-hidden overflow-x-auto gap-[10px] sm:gap-[20px] py-4">
          {
            topPost.map((item, i) => {
              const synopsisTruncate = item.synopsis !== undefined && item.synopsis.length > 100 ? item.synopsis.slice(0, 97) + "..." : item.synopsis;
              return (
                <PostDisplay key={i} className="max-w-[90vw] w-[280px] nxs:min-w-[250px] min-w-[280px]  sm:w-[320px] sm:min-w-[320px] md:w-[360px] md:min-w-[360px]" {...item} synopsis={synopsisTruncate} hideReaction />
              )
            })
          }

        </ul>
      </section>
    </div>
  );
}


function Hero() {
  return (
    <BackgroundImg src={hero} className="h-[700px] max-h-screen w-[100vw]">
      <div className="w-full h-full bg-[#0004] flex items-center justify-center flex-col">
        <div className="w-[90%] max-w-[984px]">
          <h2 className="w-full font-[700] text-[28px] xs:text-[33px] sm:text-[38px] md:text-[42px] lg:text-[48px] leading-[130%] text-white mb-[10px]">
            Welcome to Collections: A Haven for Text-Based Content
          </h2>
          <p className="text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px]  font-[500] leading-[120%] text-[#fffa] w-[70%]">
            This is a platform for free speech and artistic articulation of words. Built out of boredom of the creator and made with love. Sign up and write the best or the worst think piece you can muster.
          </p>
          <Link href={ROUTES.signup} className="mt-8 block w-[157px]">
            <BlueButton>
              Get started
            </BlueButton>
          </Link>
        </div>
      </div>
    </BackgroundImg>
  )
}

function About() {
  return (
    <article className="mx-auto mt-16 gap-16 w-[90%] grid grid-cols-1 md:grid-cols-2 mb-20 text-black" id="about">
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-5 lg:gap-7 ">
        <h3 className="font-[700] text-[32px] xs:text-[36px] sm:text-[40px] mg:text-[44px] lg:text-[48px] leading-[130%] w-full">About Collections</h3>
        <p className="text-[14px] sm:text-[16px] md:text-[18px] leading-[120%] w-full">Collections is a multi-functional platform where authors and readers can have access to their own content. It aims to be a traditional bookworm&sbquo;s heaven and a blog to get access to more text based content. Our vision is to foster an inclusive and vibrant community where diversity is celebrated. We encourage open-mindedness and respect for all individuals, regardless of their backgrounds or beliefs. By promoting dialogue and understanding, we strive </p>
      </div>
      <Image src={about} alt="people" className="w-[100%] md:w-[50%] lg:w-[40%]" />
    </article>
  )
}

function WhyJoin() {
  return (
    <article className="w-[90%] max-w-[1040px] mx-auto flex flex-col items-center mb-12 sm:mb-16 md:mb-20 text-black">
      <h3 className="font-[700] text-[28px] sm:text-[36px] md:text-[40px] lg:text-[48px] leading-[122%] pb-6">Why you should join collections</h3>
      <p className="text-[14px] sm:text-[16px] md:text-[18px] leading-[120%]">Our goal is to make writers and readers see our platform as their next heaven for blogging, ensuring ease in interactions, connecting with like-minded peers, have access to favorite content based on interests and able to communicate your great ideas with people</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 gap-4 items-center place-items-center">
        <section className="border border-[#d0d0d088] w-[100%] max-w-[306px]  h-[324px] rounded-[6px] p-4">
          <div className="w-[92px] h-[88px] rounded-full bg-[#d6d1f8] flex items-center justify-center mb-2">
            <Image src={analysisIcon} alt="graph" className="w-[32px] h-[32px]" />
          </div>
          <h4 className="font-[500] text-[24px] leading-[36px] mb-2">Analytics</h4>
          <p className="text-[14px] sm:text-[16px] md:text-[18px] leading-[120%] text-[#626262]">
            Analytics to track the number of views, likes and comment and also analyze the performance of your articles over a period of time
          </p>
        </section>

        <section className=" border border-[#d0d0d088] w-[100%] max-w-[306px]  h-[324px] rounded-[6px] p-4">
          <div className="w-[92px] h-[88px] rounded-full bg-[#d6d1f8] flex items-center justify-center mb-2">
            <Image src={peopleIcon} alt="graph" />
          </div>
          <h4 className="font-[500] text-[24px] leading-[36px] mb-2">Social interactions</h4>
          <p className="text-[14px] sm:text-[16px] md:text-[18px]  leading-[120%] text-[#626262]">
            Users on the platform can interact with posts they like, comment and engage in discussions
          </p>
        </section>
        <section className=" border border-[#d0d0d088] w-[100%] max-w-[306px]  h-[324px] rounded-[6px] p-4">
          <div className="w-[92px] h-[88px] rounded-full bg-[#d6d1f8] flex items-center justify-center mb-2">
            <Image src={documentIcon} alt="graph" />
          </div>
          <h4 className="font-[500] text-[24px] leading-[36px] mb-2">Content creation</h4>
          <p className="text-[14px] sm:text-[16px] md:text-[18px]  leading-[120%] text-[#626262]">
            Write nice and appealing with our in-built markdown, a rich text editor
          </p>
        </section>
      </div>

    </article>
  )
}

function Reviews() {
  return (
    <section className="w-full max-w-[100vw] flex align-center py-[60px] md:py-[80px] mt-10 px-40px bg-[#ffedcc] mb-20 text-black nsm:flex-col">
      <div className="w-[92%] mx-auto flex nsm:items-center nsm:flex-col gap-12">
        <Image src={avatar} alt="avatar" className="w-[270px] h-[270px] md:w-[300px] md:h-[300px] rounded-full" />
        <article className="">
          <p className="text-[14px] sm:text-[16px] sm:text-[18px] leading-[130%] text-[111] mb-8 sm:mb-12 md:mb-14">&quot;Collections was a project I made in my spare time. To showcase my technical skills. I was very happy with the results and I am very thankful to be the creator of this platform.&quot;</p>

          <div className="mb-4 sm:mb-7 md:mb-10 flex flex-col">
            <h4 className="font-[500] leading-[130%] text-[21px] sm:text-[24px] md:text-[28px] lg:text-[32px]">Victor Ubere, </h4>
            <p className="leading-[115%] text-[14px] md:text-[16px] lg:text-[18px] font-[400]">- Software developer</p>
          </div>
          <Link href={ROUTES.signup}>
            <BlueButton className="font-[700]">
              Join Collections
            </BlueButton>
          </Link>
        </article>
      </div>
    </section>
  )
}

function Expo() {

  return (
    <section className="w-[92%] max-w-[1294px] flex nmd:flex-col nmd:items-center mx-auto gap-[8%] mb-16">
      <div className="h-[280px] xs:h-[360px] md:h-[412px] w-[270px] xs:w-[90vw] sm:min-w-[300px] max-w-[352px] relative">
        <Image src={avatarLt} alt="" className="absolute left-0 top-0 rounded-full w-[120px] h-[120px] xs:w-[155px] xs:h-[155px]" />
        <Image src={avatarL} alt="" className="absolute left-0 bottom-0 rounded-full w-[120px] h-[120px] xs:w-[155px] xs:h-[155px]" />
        <Image src={avatarR} alt="" className="absolute right-0 top-[50%] translate-y-[-50%] rounded-full w-[120px] h-[120px] xs:w-[155px] xs:h-[155px]" />
      </div>
      <article>
        <h4 className="text-[32px] sm:text-[37px] md:text-[42px] lg:text-[48px] leading-[130%] font-[700] text-[#111] my-4">Write, read and connect with great minds on collections</h4>
        <p className="text-[14px] sm:text-[16px] md:text-[18px] leading-[120%] mb-10 text-black">Share people your great ideas, and also read write-ups based on your interests connect with people of same interests and goals</p>
        <Link href={ROUTES.signup} className="w-[120px] sm:w-[140px] md:w-[157px]">
          <BlueButton className="">
            Get Started
          </BlueButton>
        </Link>
      </article>
    </section>
  )
}

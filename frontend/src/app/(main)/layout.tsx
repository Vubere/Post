import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import dynamic from "next/dynamic";
import HeaderBgBlur from "../_components/header-bg-blur";

const MobileHeader = dynamic(() => import("@/app/_components/mobile-header"), {
  ssr: false
})

export const metadata: Metadata = {
  title: "Collections",
  description: "Collection of posts, short stories, essays, news and articles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"inter w-full !p-0 !m-0 overflow-x-hidden bg-white"} style={{ backgroundColor: "white" }}>
        <div className=" w-full h-full relative bg-white z-[0]">
          <header className="flex py-[20px] px-[20px] md:px-[5%] h-[90px] justify-between items-center fixed top-0 left-0 w-full  nsm:hidden z-[5]">
            <Link href={ROUTES.home}>
            <h1 className="font-bold italic text-[28px] xs:text-[34px] sm:text-[40px] md:text-[44px] lg:text-[56px]">Collections</h1>
            </Link>
<ul className="flex items-center gap-[20px]">
              <li><Link href={ROUTES.about} className="cursor-pointer text-sm hover:underline sm:text-[18px] md:text-[21px] lg:text-[24px]">About</Link></li>
              <span className=" bg-[#fff2]  grid grid-cols-2 rounded-full cursor-pointer relative [&:hover_span]:hidden w-[200px] h-[30px]">
                <span className="absolute left-0 top-0 h-full w-[50%] bg-white text-black rounded-full text-black text-sm px-2 py-1 text-[14px] sm:text-[16px] md:text-[18px]  flex items-center justify-center">Sign Up</span>
                <li><Link href={ROUTES.signup} className="block min-h-full w-full hover:bg-white min-w-[53%] hover:text-black rounded-full text-[14px] sm:text-[16px] md:text-[18px]   flex items-center justify-center">Sign Up</Link></li>
                <li><Link href={ROUTES.login} className="min-w-[47%] block hover:bg-white hover:text-black rounded-full text-[14px] sm:text-[16px] md:text-[18px]   flex items-center justify-center min-h-full">Login</Link></li>
              </span>
            </ul>
          </header>
          <MobileHeader />
          <HeaderBgBlur />
          <main className="h-auto min-h-screen ">
            {children}
          </main>
          <footer className="flex flex-col items-center bg-black">
            <p>By Victor Ubere 2024&copy;</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

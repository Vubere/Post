import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import dynamic from "next/dynamic";

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
          <header className="flex py-[20px] px-[20px] h-[90px] justify-between items-center fixed top-0 left-0 w-full  nsm:hidden z-[5]">
            <h1 className="font-bold italic text-[21px] xs:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px]">Collections</h1>
            <ul className="flex items-center gap-[20px]">
              <li><Link href={ROUTES.about} className="cursor-pointer text-sm hover:underline">About</Link></li>
              <span className="flex  bg-[#fff2]  justify-center items-center rounded-full cursor-pointer relative [&:hover_span]:hidden ">
                <span className="absolute left-0 top-0 h-full w-[53%] bg-white text-black rounded-full text-black text-sm px-2 py-1">Sign Up</span>
                <li><Link href={ROUTES.signup} className="block min-h-full w-full hover:bg-white hover:text-black rounded-full px-2 py-1 text-sm">Sign Up</Link></li>
                <li><Link href={ROUTES.login} className="block hover:bg-white hover:text-black rounded-full px-3 py-1  text-sm">Login</Link></li>
              </span>
            </ul>
          </header>
          <MobileHeader />
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

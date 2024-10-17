import type { Metadata } from "next";
import AppHeader from "../_components/app/navigations/header";
import SideNav from "../_components/app/navigations/side-nav";
import PostButton from "../_components/post-button";
import { Familjen_Grotesk } from "next/font/google";

const FG = Familjen_Grotesk({
  weight: ["400", "400", "700"],
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Collections",
  description: "Collection of posts, short stories, essays and articles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${FG.className} w-full !p-0 !m-0 overflow-hidden  !bg-white`} style={{ backgroundColor: "white" }}>

        <AppHeader />
        <PostButton />
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] md:grid-cols-[268px_1fr] h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] sm:h-[calc(100vh-70px)] sm:max-h-[calc(100vh-70px)] overflow-y-hidden bg-white">
          <SideNav />
          <main className="h-[100%] max-h-[100%] min-h-[100%] overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

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
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] md:grid-cols-[268px_1fr] h-[100vh] max-h-[100vh] overflow-y-hidden bg-white">
          <SideNav />
          <main className="h-[100vh] max-h-[100vh] overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

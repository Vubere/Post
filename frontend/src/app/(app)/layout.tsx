import type { Metadata } from "next";
import AppHeader from "../_components/app/navigations/header";
import SideNav from "../_components/app/navigations/side-nav";
import PostButton from "../_components/post-button";


export const metadata: Metadata = {
  title: "Collections",
  description: "Collection of blogs, short stories, essays, news and articles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"inter w-full !p-0 !m-0 overflow-hidden bg-white"} style={{ backgroundColor: "white" }}>
        <div className=" w-full h-full relative bg-white z-[0]">
          <AppHeader />
          <PostButton />
          <div className="grid md:grid-cols-[268px_1fr] grid-cols-[200px_1fr] h-[100vh] max-h-[100vh] overflow-y-hidden">
            <SideNav />
            <main className="h-full max-h-screen pt-[80px] overflow-y-auto">
              {children}
            </main>
          </div>
          <footer className="flex flex-col items-center bg-black">
            <p>By Victor Ubere 2024&copy;</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

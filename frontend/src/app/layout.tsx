
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { store } from "@/app/_lib/store";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const Configuration = dynamic(() => import("@/app/_components/configuration"), { ssr: false })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"bg-white "}>
        <Configuration>
          {children}
        </Configuration>
      </body>
    </html>
  );
}
//kLq$1-HafGa!1
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <header>
          <h1>Collections</h1>
          <ul>
            <li><Link href="#">About</Link></li>
            <li><Link href="#">Sign Up</Link></li>
            <li><Link href="#">Login</Link></li>
          </ul>
        </header>
        {children}
        <footer>
          <h2>Collections</h2>
          <p>Victor Ubere's Project 2024</p>
        </footer>
      </body>
    </html>
  );
}

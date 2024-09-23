
import "./globals.css";
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
//kLq$1-HafGa!1 enriqueradas@cwrotzxks.com
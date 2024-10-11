"use client";
import { persistor, store } from "@/app/_lib/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import CheckLoginStatus from "./check-login";
import { PersistGate } from "redux-persist/integration/react";
import { ourFileRouter } from "@/app/api/uploadthing/core";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <>
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Provider store={store}>
        <PersistGate loading={<div className="flex items-center justify-center h-screen text-gray-500 text-xl animate-ping font-bold">...</div>} persistor={persistor}>
          <AntdRegistry>
            <CheckLoginStatus />
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
              {children}
            </GoogleOAuthProvider>
          </AntdRegistry>
        </PersistGate>
      </Provider>
    </>
  );
}

"use client";
import { persistor, store } from "@/app/_lib/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import CheckLoginStatus from "./check-login";
import { PersistGate } from "redux-persist/integration/react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <>
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
        <PersistGate loading={null} persistor={persistor}>
          <CheckLoginStatus />
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            {children}
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

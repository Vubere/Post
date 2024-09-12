import { Form } from "antd";
import { useForm } from "react-hook-form";
import sideImage from "@/assets/backgrounds/pageText.png";
import dynamic from "next/dynamic";
import Image from "next/image";

const ForgotPasswordForm = dynamic(() => import("./components/forgot-password-form"), {
  ssr: false
})

export default function ForgotPassword() {

  return (
    <main className="w-full h-full min-h-screen flex flex-col-reverse sm:grid sm:grid-cols-2 ">
      <ForgotPasswordForm />
      <section className="w-full h-[200px] nsm:flex nsm:justify-center nsm:flex-col nsm:items-center sm:h-full px-[10px] sm:px-[7.5%] md:px-[10%] max-h-screen sm:pt-[200px] relative ">
        <div className="absolute top-0 left-0 w-[100%] h-[100%] z-[-1] bg-[#000] bg-opacity-80" />
        <Image
          fill
          src={sideImage}
          alt=""
          objectFit="cover"
          className="absolute top-0 left-0 w-[100%] h-[100%] z-[-2]"
        />
        <h2 className="text-[32px]  leading-[110%] font-bold mb-2">Forgot Password</h2>
        <p className="leading-[110%] text-[16px] font-medium text-[#fff8] max-w-[600px] nsm:max-w-[350px] nsm:text-center">Submit form to get password reset mail.</p>
      </section>
    </main>
  )
}
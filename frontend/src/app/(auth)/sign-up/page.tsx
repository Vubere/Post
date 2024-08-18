import { Form } from "antd";
import { useForm } from "react-hook-form";
import sideImage from "@/assets/backgrounds/bookStack.jpeg"
import dynamic from "next/dynamic";
import Image from "next/image";

const SignupForm = dynamic(() => import("./components/sign-up-form"), {
  ssr: false
})

export default function Signup() {

  return (
    <main className="w-full h-full min-h-screen flex flex-col-reverse sm:grid sm:grid-cols-2 ">
      <SignupForm />
      <section className="w-full h-[200px] nsm:flex nsm:justify-center nsm:flex-col nsm:items-center sm:h-full px-[10px] sm:px-[7.5%] md:px-[10%] max-h-screen sm:pt-[200px] relative ">
        <div className="absolute top-0 left-0 w-[100%] h-[100%] z-[-1] bg-[#000] bg-opacity-80" />
        <Image
          fill
          src={sideImage}
          alt=""
          objectFit="cover"
          className="absolute top-0 left-0 w-[100%] h-[100%] z-[-2]"
        />
        <h2 className="text-[32px]  leading-[110%] font-bold mb-2">SIGN UP</h2>
        <p className="leading-[110%] text-[16px] font-medium text-[#fff8] max-w-[600px] nsm:max-w-[350px] nsm:text-center">Sign up to our platform and start curating your own thoughts.</p>
      </section>
    </main>
  )
}
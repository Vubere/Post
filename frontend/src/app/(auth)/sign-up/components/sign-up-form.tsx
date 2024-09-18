"use client";
import Button from "@/app/_components/general/button";
import Input from "@/app/_components/input";
import { useGetAllUsersQuery, useGoogleSignInMutation, useSignUpMutation } from "@/app/_lib/api/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, notification } from "antd";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";
import GoogleAuth from "@/app/_components/google-auth";
import { useAppDispatch } from "@/app/_lib/store/hooks";
import { useRouter } from "next/navigation";
import { updateToken, updateUserInfo } from "@/app/_lib/store/user";

const schema = yup.object({
  firstName: yup.string().required().trim().label("First Name"),
  lastName: yup.string().required().trim().label("Last Name"),
  email: yup.string().email("Invalid email address").required().trim().label("Email"),
  dateOfBirth: yup.string().required().label("Date of Birth"),
  password: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
      {
        message:
          "Password should have at least 8 characters combining an uppercase and a lower case letters, at least a number and a special character",
      }
    )
    .required("Password is required")
    .trim()
    .label("Password"),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Password and confirm password don't match!")
    .label("Confirm Password"),
})

export default function SignupForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [signUp, {
    isLoading,
  }] = useSignUpMutation();
  const [googleSignIn, { isLoading: googleLoading }] = useGoogleSignInMutation();
  useGetAllUsersQuery({})
  const onGoogleSuccess = async (cred: any) => {
    try {
      const data = await googleSignIn({ token: cred.access_token });
      if (data?.data) {
        localStorage.setItem("collections-user-token", data.data.token);
        dispatch(updateToken(data.data.token));
        dispatch(updateUserInfo(data.data.data));
        toast.success(data.data.message || "success!");
        setTimeout(() => {
          router.push(ROUTES.dashboard);
        }, 2000);
      } else {
        toast.error("could not find user data!");
      }
    } catch (err) {
      console.log(err);
      toast.error("failed to get user info, retry!")
    }
  }

  const onGoogleError = () => {
    toast.error("google authentication failed, try again!");
  }
  const { handleSubmit, ...rest } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (vals: any) => {
    try {
      const data = await signUp(vals)
      if (data?.data) {
        localStorage.setItem("collections-user-token", data.data.token);
        dispatch(updateToken(data.data.token));
        dispatch(updateUserInfo(data.data.data));
        toast.success(data.data.message || "success!");
        setTimeout(() => {
          router.push(ROUTES.dashboard);
        }, 2000);
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <section className="bg-white min-h-screen px-4 pt-8 flex flex-col sm:justify-center items-center w-full">
      <div className="mb-4 w-full max-w-[400px]">
        <p className="text-black font-medium leading-[110%] text-sm">Sign up to join up network of word curators.</p>
      </div>
      <Form onFinish={handleSubmit(onSubmit)} className="flex flex-col gap-[20px] max-w-[400px] w-full ">
        <Input type="email" label="Email" placeholder="user@email.com" name="email" state={rest} required />
        <Input label="First Name" placeholder="Vic" name="firstName" state={rest} required />
        <Input label="Last Name" placeholder="Tor" name="lastName" state={rest} required />
        <Input label="Date of Birth" placeholder="Date of Birth" type="date" name="dateOfBirth" state={rest} required />
        <Input label="Password" placeholder="********" name="password" state={rest} required />
        <Input label="Confirm Password" name="confirmPassword" placeholder="********" required state={rest} />
        <Button type="submit" loading={isLoading || googleLoading} disabled={isLoading || googleLoading}>Sign In</Button>
      </Form>
      <div className="relative w-full flex justify-center ">
        <span className="block bg-[#fff] p-1 relative z-[1] text-black font-medium">
          OR
        </span>
        <hr className=" block h-[2px] w-full bg-[#0003] bg-opacity-40 absolute z-[0] left-0 top-[50%] " />
      </div>
      <GoogleAuth onSuccess={onGoogleSuccess} onError={onGoogleError} loading={isLoading || googleLoading} className="mb-1 max-w-[400px]" />
      <div className="mt-4 w-full max-w-[400px]">
        <p className="text-gray-400 text-[11px] text-center leading-[110%] text-sm">Already have an account? <Link className="hover:underline hover:text-blue-300" href={ROUTES.signup}>Login</Link></p>
      </div>
    </section>
  )
}

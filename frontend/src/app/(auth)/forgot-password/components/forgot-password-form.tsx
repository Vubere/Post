"use client";
import Button from "@/app/_components/general/button";
import Input from "@/app/_components/input";
import { useLoginMutation } from "@/app/_lib/api/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "antd";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ROUTES } from "@/app/_lib/routes";
import Link from "next/link";

const schema = yup.object({
  email: yup.string().email("Invalid email address").required().trim().label("Email"),
  password: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
      {
        message:
          "Passwords has at least 8 characters combining an uppercase and a lower case letters, at least a number and a special character",
      }
    )
    .required("Password is required")
    .trim()
    .label("Password"),
})

export default function LoginForm() {
  const [login, {
    data,
    isLoading,
    error,
    isSuccess,
    isError,
    reset,
    isUninitialized
  }] = useLoginMutation();
  const { handleSubmit, ...rest } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (vals: any) => {
    login(vals)
  }

  return (
    <section className="bg-white min-h-screen px-4 pt-8 flex flex-col sm:justify-center items-center w-full">
      <Form onFinish={handleSubmit(onSubmit)} className="flex flex-col gap-[20px] max-w-[400px] w-full ">
        <Input type="email" label="Email" placeholder="user@email.com" name="email" state={rest} required />
        <Button type="submit" loading={isLoading}>Submit</Button>
      </Form>
      <div className="mt-4 w-full max-w-[400px]">
        <p className="text-gray-400 text-[11px] text-center leading-[110%] text-sm">Remember password?  <Link className="hover:underline hover:text-blue-300" href={ROUTES.login}>Login.</Link></p>
        <p className="text-gray-400 text-[11px] text-center leading-[110%] text-sm">Don't have an account? <Link className="hover:underline hover:text-blue-300" href={ROUTES.signup}>Sign up</Link></p>
      </div>
    </section>
  )
}

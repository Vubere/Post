"use client";
import Button from "@/app/_components/general/button";
import Input from "@/app/_components/input";
import { useSignUpMutation } from "@/app/_lib/api/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "antd";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";
import Link from "next/link";
import { ROUTES } from "@/app/_lib/routes";

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
  const [signUp, {
    data,
    isLoading,
    error,
    isSuccess,
    isError,
    reset,
    isUninitialized
  }] = useSignUpMutation();
  const { handleSubmit, ...rest } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (vals: any) => {
    signUp(vals)
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
        <Button type="submit" loading={isLoading}>Submit</Button>
      </Form>
      <div className="mt-4 w-full max-w-[400px]">
        <p className="text-gray-400 text-[11px] text-center leading-[110%] text-sm">Already have an account? <Link className="hover:underline hover:text-blue-300" href={ROUTES.signup}>Login</Link></p>
      </div>
    </section>
  )
}

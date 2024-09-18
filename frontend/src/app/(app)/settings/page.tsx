"use client";
import PageContainer from "@/app/_components/general/page-container";
import { useAppDispatch, useAppSelector } from "@/app/_lib/store/hooks";
import { RootState } from "@/app/_lib/store";
import Tab from "@/app/_components/tab";
import { useMemo } from "react";
import { Form, Skeleton } from "antd";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/_components/input";
import Button from "@/app/_components/general/button";
import { useUpdatePrivacySettingsMutation, useUpdateUserPasswordMutation } from "@/app/_lib/api/user";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@/app/_lib/type";
import { toast } from "react-toastify";
import { updateToken } from "@/app/_lib/store/user";
import { LS_TOKEN_NAME, SECTION_CLASSNAME } from "@/app/_lib/utils/constants";


export default function Settings() {
  const { info } = useAppSelector((state: RootState) => state.user);

  const sectionsClassName = SECTION_CLASSNAME + " flex flex-col items-center py-[20px] mt-6 max-w-[500px] mx-auto";

  const NotificationComponent = useMemo(() => <Notification className={sectionsClassName} userInfo={info} />, [info]);
  const PrivacyComponent = useMemo(() => <Privacy className={sectionsClassName} userInfo={info} />, [info]);
  const PasswordComponent = useMemo(() => <Password className={sectionsClassName} userInfo={info} />, [info]);


  const Items = [
    { content: NotificationComponent, title: "Notification", loading: false },
    { content: PrivacyComponent, title: "Privacy", loading: false },
    ...(info?.signUpMethod !== "google-auth" ? [{ content: PasswordComponent, title: "Password", loading: false }] : []),
  ]

  return (
    <PageContainer title="Settings">
      <Tab
        items={Items}
        loading={false}
      />

    </PageContainer>
  )
}

type Props = {
  className?: string;
  userInfo: User | null
}

const Notification = ({ className, userInfo }: Props) => {
  const id = userInfo?._id;
  const [updateNotifications, { isLoading }] = useUpdatePrivacySettingsMutation();

  const { handleSubmit, reset, ...rest } = useForm();
  console.log(id)
  if (!id) {
    return (
      <Skeleton />
    )
  }

  const onSubmit = (vals: FieldValues) => {

    updateNotifications({ notificationAccess: vals?.notificationAccess?.split(",") })
      .then((res) => {
        console.log(res)
        if (["success", "success!"].includes(res?.data?.status)) {
          toast.success(res?.data?.message || "success");
          return;
        }
        toast.error("failed to change password!");
      });
  }

  return (
    <section className={`${className} !py-[40px]`}>
      <div className="mb-4 w-full max-w-[400px]">
        <p className="text-black font-medium leading-[110%] text-sm mx-auto">Update what users' event can send you notifications.</p>
      </div>
      <Form onFinish={handleSubmit(onSubmit)} className="flex flex-col gap-[20px] max-w-[400px] w-full ">
        <Input label="Get Notifications When" type="select" placeholder="Get Notifications When" name="notificationAccess" state={rest} required options={[{ label: "All(public)", value: "subscribers,followers,subscribers,all" }, { label: "Subscribers", value: "subscribers" }, { label: "Followers", value: "subscribers,followers" }]} twHeight="h-auto" />

        <Button type="submit" loading={isLoading} disabled={isLoading}>Update</Button>
      </Form>
    </section>
  )
}
const Privacy = ({ className, userInfo }: Props) => {
  const id = userInfo?._id;
  const [updateNotifications, { isLoading }] = useUpdatePrivacySettingsMutation();

  const { handleSubmit, reset, ...rest } = useForm();
  console.log(id)
  if (!id) {
    return (
      <Skeleton />
    )
  }

  const onSubmit = (vals: FieldValues) => {
    updateNotifications({ messageAccess: vals?.messageAccess?.split(",") })
      .then((res) => {
        if (["success", "success!"].includes(res?.data?.status)) {
          toast.success(res?.data?.message || "success");
          return;
        }
        toast.error("failed to change password!");
      });
  }

  return (
    <section className={`${className} !py-[40px]`}>
      <div className="mb-4 w-full max-w-[400px]">
        <p className="text-black font-medium leading-[110%] text-sm mx-auto">Update privacy.</p>
      </div>
      <Form onFinish={handleSubmit(onSubmit)} className="flex flex-col gap-[20px] max-w-[400px] w-full ">
        <Input label="Get Messages From" type="select" placeholder="Get Messages From" name="messageAccess" state={rest} required options={[{ label: "All(public)", value: "subscribers,followers,subscribers,all" }, { label: "Subscribers", value: "subscribers" }, { label: "Followers", value: "subscribers,followers" }]} twHeight="h-auto" />

        <Button type="submit" loading={isLoading} disabled={isLoading}>Update</Button>
      </Form>
    </section>
  )
}

const PasswordSchema = yup.object({
  password: yup.string().required().label("Current Password").trim(),
  newPassword: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
      {
        message:
          "Passwords has at least 8 characters combining an uppercase and a lower case letters, at least a number and a special character",
      }
    )
    .required("New Password is required")
    .trim()
    .label("New Password"),
  confirmPassword: yup.string().oneOf([yup.ref("newPassword")], "New Password and Confirm Password fields should match").required().label("Confirm Password")
});
const Password = ({ className, userInfo }: Props) => {
  const id = userInfo?._id;
  const dispatch = useAppDispatch();
  const [setPassword, { isLoading }] = useUpdateUserPasswordMutation();

  const { handleSubmit, reset, ...rest } = useForm({
    mode: "onBlur",
    resolver: yupResolver(PasswordSchema)
  })

  if (!id) {
    return (
      <Skeleton />
    )
  }

  const onSubmit: SubmitHandler<{ password: string; newPassword: string; confirmPassword: string; }> = (vals) => {
    setPassword({ id, ...vals })
      .then((res) => {
        if (["success", "success!"].includes(res?.data?.status)) {
          toast.error(res?.data?.message || "success");
          const token = res?.data?.token;
          dispatch(updateToken(token));
          localStorage.setItem(LS_TOKEN_NAME, token);
        }
        toast.error("failed to change password!");
      });
  }

  return (
    <section className={`${className} !py-[40px]`}>
      <div className="mb-4 w-full max-w-[400px]">
        <p className="text-black font-medium leading-[110%] text-sm mx-auto">Fill to Change Password.</p>
      </div>
      <Form onFinish={handleSubmit(onSubmit)} className="flex flex-col gap-[20px] max-w-[400px] w-full ">
        <Input label="Current Password" placeholder="********" name="password" state={rest} required />
        <Input label="New Password" placeholder="********" name="password" state={rest} required />
        <Input label="Confirm Password" placeholder="********" name="password" state={rest} required />
        <Button type="submit" loading={isLoading} disabled={isLoading}>Change</Button>
      </Form>
    </section>
  )
}

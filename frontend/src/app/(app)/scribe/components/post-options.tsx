import Button from "@/app/_components/general/button";
import Input from "@/app/_components/input";
import { useCreatePostMutation } from "@/app/_lib/api/post";
import { PostPayload } from "@/app/_lib/type";
import { Modal } from "antd";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";



type Props = {
  open: boolean;
  onCancel: (v: any) => void,
  postDetails: Record<string, any>,
  resetDetails: () => void,
}


export default function PostOptions({ open, onCancel, postDetails, resetDetails }: Props) {
  const accessOptions = [{ label: "All", value: "subscribers,followers,public" }, { label: "Subscribers", value: "subscribers" }, { label: "Followers", value: "subscribers,followers" }];
  const paywallOptions = [{ label: "All(including subscribers)", value: "subscribers,followers,public" }, { label: "Followers", value: "followers,public" }, { label: "Public", value: "public" }];
  const typeOptions = [{ label: "Post", value: "post" }, { label: "Essay", value: "Essay" }, { label: "Short Story", value: "short story" }];
  const { register, formState, control, setValue, getValues, reset } = useForm();
  const [sendPost, {
    isLoading
  }] = useCreatePostMutation();
  const paywalled = !!useWatch({
    control,
    name: "paywall"
  })


  const onSubmit = (status: 0 | 1) => {
    const data = getValues();
    const payload = {
      ...data,
      paywalledUsers: (data.paywall || "").split(","),
      isPaywalled: !!data.paywall?.length,
      userAccess: (data.userAccess || "").split(","),
      status,
      ...postDetails
    }
    sendPost(payload as PostPayload).then((res) => {
      if (res?.data?.data?.success === "success") {
        toast.success(res?.data?.data?.message || "success");
        reset();
        resetDetails();
      }
    });
  }
  const draftClick = () => onSubmit(0);
  const publishClick = () => onSubmit(1);



  return (
    <Modal open={open} onCancel={onCancel} closable okButtonProps={{ className: "hidden" }} cancelButtonProps={{ className: "hidden" }}>
      <h4 className="text-[16px] xs:text-[18px] sm:text-[21px] md:text-[24px] lg:text-[28px] font-bold leading-[105%]">Publish or Draft Post</h4>
      <div className="pt-[20px] w-full h-full">
        <h5 className="text-[#737373] font-medium text-[12px] sm:text-[14px] mb-4">Optional Post Configurations</h5>
        <div className="flex flex-col gap-1">
          <Input
            type="select"
            label="Type"
            name="type"
            placeholder="select type"
            options={typeOptions}
            state={{
              formState,
              register,
              control,
              getValues
            }}
          />
          <Input
            type="multi-input"
            label="Categories"
            name="categories"
            placeholder="Select Cateogories"
            state={{
              formState,
              register,
              control,
              getValues
            }}
            twHeight="h-auto"
            multiTextOptions={[]}
          />
          <Input
            type="select"
            options={accessOptions}
            label="Viewable by"
            placeholder="select user access"
            name="userAccess"
            state={{
              formState,
              register,
              control,
              getValues
            }}
          />
          <Input
            type="select"
            placeholder="select users that have to pay to view"
            options={paywallOptions}
            label="Paywall"
            name="paywall"
            state={{
              formState,
              register,
              control,
              getValues
            }}
          />
          {paywalled && <Input
            type="number"
            placeholder="paywall fee"
            label="Paywall Fee"
            name="paywallFee"
            state={{
              formState,
              register,
              control,
              getValues
            }}
          />}

          <div className="flex gap-4 mt-4">
            <Button theme="light" text="Draft" type="button" onClick={draftClick} disabled={isLoading} />
            <Button className="!bg-[#44d]" text="Publish" type="submit" onClick={publishClick} disabled={isLoading} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
"use client";
import Button from "@/app/_components/general/button";
import ImageUploader from "@/app/_components/general/image-uploader";
import PageContainer from "@/app/_components/general/page-container";
import Input, { NormalInput } from "@/app/_components/input";
import { useUpdateSectionsMutation, useUpdateUserMutation } from "@/app/_lib/api/user";
import useGetAndUpdateProfile from "@/app/_lib/hooks/use-get-and-update-profile";
import { RootState } from "@/app/_lib/store";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import avatar from "@/assets/icons/avatar.png";
import * as yup from "yup";

const schema = yup.object({
  firstName: yup.string().required().label("First Name").trim(),
  lastName: yup.string().required().label("Last Name").trim(),
  username: yup.string().required().label("Username").trim(),
  biography: yup.string().label("Biography").trim(),
  interest: yup.array().required().label("Interest"),
  dateOfBirth: yup.mixed().required().label("Date Of Birth"),

})

export default function EditProfile() {
  const { info } = useAppSelector((state: RootState) => state.user);
  const { getProfile, isLoading: getProfileLoading } = useGetAndUpdateProfile();
  const [updateUserInfo, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [updateSection, { isLoading }] = useUpdateSectionsMutation();
  const [sectionsArray, setSectionsArray] = useState<Section[]>([]);
  const [newSection, setNewSection] = useState<Section>({
    name: "",
    content: ""
  })
  useEffect(() => {
    if (info) {
      setSectionsArray(info.profileSections as Section[])
    }
  }, [info]);

  const { control, formState, register, getValues, reset, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const removeProfilePhoto = () => {
    onSubmit({
      profilePhoto: ""
    });
  }

  const onUrlUpdate = (url: string) => {
    onSubmit({
      profilePhoto: url
    })
  }

  useEffect(() => {
    if (info?.username)
      reset({
        firstName: info.firstName,
        lastName: info.lastName,
        username: info.username,
        interest: info.interest,
        dateOfBirth: info.dateOfBirth ? dayjs(info.dateOfBirth).format("YYYY-MM-DD") : "",
        biography: info.biography,
      })
  }, [info]);

  const onSubmit = (val: any) => {
    if (info)
      updateUserInfo({ id: info?.id, ...val })
        .then((res) => {
          if (res?.data?.status === "success!") {
            toast.success(res?.data?.message || "success");
            setTimeout(() => {
              getProfile();
            }, 2000);
          }
        })
  }

  /* section management */
  const onChange = ({ target }: any) => {
    const { value, name } = target;
    setNewSection(prev => ({ ...prev, [name]: value }));
  }
  const addSection = async () => {
    if (Array.isArray(info?.profileSections)) {
      updateAllSections({
        profileSections: [...(info.profileSections ?? []), newSection]
      }, () => {
        setNewSection({
          name: "",
          content: "",
        });
      });
    }
  }
  const updateAllSections = (val: {
    profileSections: Section[]
  }, cb?: () => void) => {
    updateSection(val).then((res) => {
      if (res?.data?.status === "success") {
        toast.success(res?.data?.message || "success");
        setTimeout(() => {
          getProfile().then(() => {
            cb?.();
          });
        }, 2000);
      }
    })
  }

  return (
    <PageContainer title="Edit Profile">
      <section className="max-w-[500px] mx-auto">
        <div className="flex items-center justify-center mb-12">
          <ImageUploader url={info?.profilePhoto} setUrl={onUrlUpdate} removeLink={removeProfilePhoto} className="w-[80px] h-[80px] rounded-full" defaultImage={avatar} />
        </div>
        <Form className="flex flex-col gap-2 mb-8" onFinish={handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <Input type="text" name="firstName" placeholder="First Name" label="First Name" state={{
              control,
              formState,
              register,
              getValues
            }} />
            <Input type="text" name="lastName" placeholder="Last Name" label="Last Name" state={{
              control,
              formState,
              register,
              getValues
            }} />
          </div>
          <Input type="text" name="username" label="Username" placeholder="Username" state={{
            control,
            formState,
            register,
            getValues
          }} />
          <Input type="date" name="dateOfBirth" label="Date of Birth" placeholder="Date of Birth" state={{
            control,
            formState,
            register,
            getValues
          }} />
          <Input type="textarea" name="biography" label="Biography" placeholder="Biography" state={{
            control,
            formState,
            register,
            getValues
          }} twHeight="h-auto" />
          <Input type="multi-input" name="interest" label="Interest" placeholder="Interest" state={{
            control,
            formState,
            register,
            getValues
          }} twHeight="h-auto" />
          <Button className="" type="submit" disabled={isUpdatingUser} loading={isUpdatingUser}>Update</Button>
        </Form>
        <div>
          <h4 className="font-bold mb-4">Add Additional details <span className="italic font-light text-[#373737]">(career, profession...)</span>.</h4>
          <div>
            <div className="flex flex-col gap-2 mb-4">
              <NormalInput type="text" name="name" placeholder="Title" label="Title" onChange={onChange} value={newSection.name} />
              <NormalInput type="textarea" name="content" placeholder="Content" label="Content" onChange={onChange} value={newSection.content} />
              <Button className="text-center" onClick={addSection} disabled={isLoading} loading={isLoading}>Add +</Button>
            </div>
            {!!sectionsArray.length &&
              <>
                <h5 className="font-medium text-[#6d6d6d99] mb-2">Existing Section(s)</h5>
                <div className="flex flex-col gap-4">

                  {sectionsArray?.map(
                    (item, index) => <SectionComponent section={item} index={index} sections={info?.profileSections as Section[]} updateAllSections={updateAllSections} loading={isLoading} />
                  )}
                </div>
              </>
            }
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
type Section = {
  name: string,
  content: string
}
const SectionComponent = ({ index, section, sections, updateAllSections, loading }: {
  index: number, section: Section, sections: Section[], updateAllSections: (val: {
    profileSections: Section[];
  }) => void, loading: boolean
}) => {
  const [sectionVals, setSectionVals] = useState<Section>({
    name: "",
    content: ""
  });

  useEffect(() => {
    setSectionVals(section);
  }, [section]);

  const onChange = ({ target }: any) => {
    const { value, name } = target;
    setSectionVals(prev => ({ ...prev, [name]: value }));
  }

  const updateSection = () => {
    const allSections = [...sections];
    allSections[index] = sectionVals;
    updateAllSections({
      profileSections: allSections
    })
  }
  const removeSection = () => {
    let allSections = [...sections];
    allSections = allSections.filter((_, i) => index !== i);
    updateAllSections({
      profileSections: allSections
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <NormalInput type="text" name="name" placeholder="Title" label="Title" onChange={onChange} value={sectionVals.name} />
      <NormalInput type="textarea" name="content" placeholder="Content" label="Content" onChange={onChange} value={sectionVals.content} />
      <div className="flex gap-2">
        <Button className="text-center" onClick={removeSection} loading={loading} disabled={loading} theme="danger">Remove</Button>
        <Button className="text-center" onClick={updateSection} disabled={loading} loading={loading}>Update</Button>
      </div>
    </div>
  )
}

/* 
profile photo,
first name - lastname,
username,
interest,
biography,
sections

*/
"use client";
import { ROUTES } from "@/app/_lib/routes";
import { useRouter } from "next/navigation";
import { useLazyGetProfileQuery } from "../../_lib/api/user";
import { LS_TOKEN_NAME } from "@/app/_lib/utils/constants";
import { useAppDispatch } from "@/app/_lib/store/hooks";
import { updateToken, updateUserInfo } from "@/app/_lib/store/user";



export default function useGetAndUpdateProfile() {
  const dispatch = useAppDispatch();
  const [getUser, { isLoading }] = useLazyGetProfileQuery();
  const router = useRouter();

  const getProfile = async () => {
    const token = localStorage.getItem(LS_TOKEN_NAME);
    if (token) {
      getUser(token).then((res: any) => {
        console.log(res)
        if (res.status === "rejected") {
          return;
        }
        dispatch(updateToken(token));
        dispatch(updateUserInfo(res?.data?.data));
      }).catch((err) => {
        console.log(err)
        router.push(ROUTES.login);
        localStorage.clear();
      })
    } else {
      router.push(ROUTES.login);
    }
  };
  return {
    getProfile,
    isLoading
  }
}
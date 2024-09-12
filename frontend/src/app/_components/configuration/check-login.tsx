"use client";
import { ROUTES } from "@/app/_lib/routes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useLazyGetProfileQuery } from "../../_lib/api/user";
import { LS_TOKEN_NAME } from "@/app/_lib/utils/constants";
import { useAppDispatch } from "@/app/_lib/store/hooks";
import { updateToken, updateUserInfo } from "@/app/_lib/store/user";



export default function CheckLoginStatus() {
  const dispatch = useAppDispatch();
  const [getUser] = useLazyGetProfileQuery();
  const router = useRouter();
  const pathname = usePathname() as ROUTES;
  const publicRoutes = [ROUTES.dashboard, ROUTES.login, ROUTES.signup, ROUTES.forgotPassword, ROUTES.resetPassword, ROUTES.home, ROUTES.about];
  useEffect(() => {
    const token = localStorage.getItem(LS_TOKEN_NAME);
    if (token) {
      //verify if token is valid then redirect to dashboard
      getUser(token).then((res: any) => {

        dispatch(updateToken(token));
        dispatch(updateUserInfo(res.data?.data));
        if (publicRoutes.includes(pathname)) {
          router.push(ROUTES.dashboard);
        }
      }).catch(() => {
        localStorage.removeItem(LS_TOKEN_NAME);
      })
    } else {
      router.push(ROUTES.login);
    }
  }, [pathname])
  return null
}
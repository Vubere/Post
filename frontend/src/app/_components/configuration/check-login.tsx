"use client";
import { ROUTES } from "@/app/_lib/routes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useLazyGetProfileQuery } from "../../_lib/api/user";
import { LS_TOKEN_NAME } from "@/app/_lib/utils/constants";
import { useAppDispatch } from "@/app/_lib/store/hooks";
import { updateToken, updateUserInfo } from "@/app/_lib/store/user";
import { saveTokenAsCookie } from "@/app/_lib/services";



export default function CheckLoginStatus() {
  const dispatch = useAppDispatch();
  const [getUser] = useLazyGetProfileQuery();
  const router = useRouter();
  const pathname = usePathname() as ROUTES;
  const publicRoutes = [ROUTES.login, ROUTES.signup, ROUTES.forgotPassword, ROUTES.resetPassword, ROUTES.home, ROUTES.about, "/", ""];
  useEffect(() => {
    const token = localStorage.getItem(LS_TOKEN_NAME);
    if (token) {

      getUser(token).then((res: any) => {
        if (res.status === "fulfilled") {
          dispatch(updateToken(token));
          saveTokenAsCookie(token);

          dispatch(updateUserInfo(res?.data?.data));
          if (publicRoutes.includes(pathname)) {
            router.push(ROUTES.dashboard);
          }
          return;
        }
        /* router.push(ROUTES.login);
        localStorage.clear();
        return; */
      }).catch((err) => {
        router.push(ROUTES.login);
        localStorage.clear();
      })
    } else {
      if (!publicRoutes.includes(pathname)) {
        router.push(ROUTES.home);
      }
    }
  }, [pathname])
  return null
}
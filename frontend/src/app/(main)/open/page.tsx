import { ROUTES } from "@/app/_lib/routes";
import { redirect } from "next/navigation";



export default function Open() {
  redirect(ROUTES.home)
  return null;
}
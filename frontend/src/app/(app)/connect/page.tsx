import { Metadata } from "next";
import ConnectPage from ".";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Connect",
  description: `Connect with other members of the Collections community.`,
}
const getUsers = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      }).then(res => res.json());
      return { data: res?.data, status: "success" };
    } else {
      return ({
        message: "no token ent",
        status: "failed",
      });
    }
  } catch (error) {
    return ({
      error,
      status: "failed",
    });
  }
}


export default async function Connect() {
  const data = await getUsers();
  console.log(data)
  return (
    <ConnectPage />
  )
}
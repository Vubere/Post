import { cookies } from "next/headers";
import AccountPage from ".";



export const revalidate = 5;
async function getProfile() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`, {
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

export async function generateMetadata() {
  const user = await getProfile();
  const name = user?.data?.fullName ? `${user?.data?.fullName || ""}` : "Account";
  const biography = user?.data?.biography
  return {
    title: name ? name : "Account",
    description: biography || `Account information`
  }
}


export default async function Account() {
  const user = await getProfile();
  const userInfo = user?.data;
  return (
    <AccountPage userInfo={userInfo} />
  )
}
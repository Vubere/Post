import { cookies } from "next/headers";
import AccountPage from "..";



type Params = {
  id: string
}
interface AccountArgs {
  params: Params
}
export const revalidate = 1;
async function getUser(id: string) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (token && id) {

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, {
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

export async function generateMetadata({ params }: AccountArgs) {
  const user = await getUser(params.id);
  const name = user?.data?.fullName ? `${user?.data?.fullName || ""}` : "Account";
  const biography = user?.data?.biography
  return {
    title: name ? name : "Account",
    description: biography || `Account information`
  }
}


export default async function Account({ params }: AccountArgs) {
  const user = await getUser(params.id);
  const userInfo = user?.data;
  if (user?.status === "failed") {
    return <div>Error fetching post, reload page!</div>
  }
  return (
    <AccountPage userInfo={userInfo} />
  )
}
import { cookies } from "next/headers";
import PageContainer from "@/app/_components/general/page-container";
import ListUsers from "@/app/_components/list-users";

type Params = {
  id: string
}
interface Args {
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
const getFollowers = async (userId: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      const queryParams = (new URLSearchParams({ userId })).toString();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/followers?${queryParams}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
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
export async function generateMetadata({ params }: Args) {
  const user = await getUser(params.id);
  const name = user?.data?.fullName ? `${user?.data?.fullName || ""}` : "Account";
  return {
    title: name ? `People following ${name}` : "Following",
    description: `People following ${name || ""}`
  }
}

export default async function Followers({ params }: Args) {
  const data = await getUser(params.id);
  const followingData = await getFollowers(params.id);

  return (
    <PageContainer title={`Users Following ${data?.data?.username}`}>
      <ListUsers users={followingData?.data || []} />
    </PageContainer>
  )
}
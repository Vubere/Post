import { cookies } from "next/headers";
import ChatPage from ".";

export const revalidate = 5;
async function getUser(userId: string) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      }).then(res => res.json());
      return { data: res?.data, status: "success" };
    } else {
      return ({
        message: "no token sent",
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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  const name = user?.data?.fullName ? `${user?.data?.fullName || ""}` : "Account";
  return {
    title: `Chat with ${name || user}`,
    description: `Chat with ${name || "user"}`,
  }
}

export default async function Account() {

  return (
    <ChatPage />
  )
}
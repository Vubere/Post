import { Post, User } from "../type";

export async function saveTokenAsCookie(token: string) {
  try {
    const response = await fetch("/api/set-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save token. Status: ${response.status}`);
    }

    const data = await response.json();
  } catch (error: any) {
    console.error("Error saving token as cookie:", error.message);
  }
}

export const loadMoreItems = async (
  page: number,
  fetch: any,
  limit = 10,
  params?: Record<string, any>
) => {
  try {
    const data = await fetch({
      page,
      limit,
      ...(params || {}),
    });
    return data.data?.data || [];
  } catch (err) {
    return [];
  }
};
export const paywallCheck = ({ user, post }: { user: User; post: Post }) => {
  const { isPaywalled, paywalledUsers, authorDetails, paywallPayedBy } = post;
  const authorId = authorDetails?.id || authorDetails?._id;
  const userId = (user?.id || user?._id) as string;

  if (
    !isPaywalled ||
    paywallPayedBy?.includes((user?._id || user?.id) as string) ||
    authorId === userId ||
    paywalledUsers?.length === 0
  )
    return false;
  const restrictionLevel = paywalledUsers?.includes("subscribers")
    ? "subscribers"
    : paywalledUsers?.includes("followers")
    ? "followers"
    : "public";
  if (
    restrictionLevel !== "subscribers" &&
    authorDetails?.subscribers?.includes(userId)
  )
    return false;
  if (
    restrictionLevel !== "followers" &&
    authorDetails?.followers?.includes(userId)
  )
    return false;

  return true;
};

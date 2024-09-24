import { User } from "@/app/_lib/type";

import PageContainer from "@/app/_components/general/page-container";
import ListUsers from "@/app/_components/list-users";


export default function ConnectPage({ users }: { users: User[] }) {
  const usersList = users?.length ? users : [];

  return (
    <PageContainer title="Connect with Users">
      <ListUsers users={usersList} />
    </PageContainer>
  )
}

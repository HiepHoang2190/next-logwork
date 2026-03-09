export const dynamic = "force-dynamic";

import {
  getAllDataUser,
  getCurrentUserData
} from "@/app/lib/fetchApi";
import ComponentLeavePage from "@/app/ui/dashboard/leave/leave";

export async function generateMetadata({ searchParams }) {
  const currentUser = await getCurrentUserData();
  const dataAllUser = await getAllDataUser();

  return {
    title: `${
      searchParams?.username
        ? dataAllUser
            .filter((item) => item.user_name === searchParams?.username)
            .map((user) => user.display_name)
        : currentUser.displayName
    } - Leave Request`,
  };
}

const Page = async ({ searchParams }) => {

  return (
    <div className="mt-3">
      <ComponentLeavePage searchParams={searchParams} />
    </div>
  );
};

export default Page;

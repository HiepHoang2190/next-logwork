"use server";

import dynamic from "next/dynamic";
import Loading from "@/app/ui/dashboard/loading/loading";
import Unauthorized from "@/app/ui/dashboard/unauthorized/unauthorized";
import {
  fetchDataLeave,
  getAllDataUser,
  getCurrentUserData,
  getUserCurrentIssues,
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

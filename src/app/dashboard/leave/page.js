"use server";

import { auth } from "@/app/auth";
import dynamic from "next/dynamic";
import Loading from "@/app/ui/dashboard/loading/loading";
import Unauthorized from "@/app/ui/dashboard/unauthorized/unauthorized";
import {
  fetchDataLeave,
  getAllDataUser,
  getUserCurrentIssues,
} from "@/app/lib/fetchApi";

export async function generateMetadata({ searchParams }) {
  const { user } = await auth();
  const dataAllUser = await getAllDataUser();

  return {
    title: `${
      searchParams?.username
        ? dataAllUser
            .filter((item) => item.user_name === searchParams?.username)
            .map((user) => user.display_name)
        : user.displayName
    } - Leave Request`,
  };
}

const Page = async ({ searchParams }) => {
  //Fetch Data
  const { user } = await auth();
  const dataAllUser = await getAllDataUser();
  const currentData = await getUserCurrentIssues();

  var username = searchParams?.username;
  username = username !== undefined ? username : user.username;

  if (currentData === "Unauthorized!") {
    return <Unauthorized status={"Unauthorized!"} />;
  }
  if (currentData === "fetch failed" || dataAllUser === "fetch failed") {
    return <Unauthorized status={"fetch failed"} />;
  }

  const currentUserData = dataAllUser.find(
    (data) => data.user_name === username
  );
  const { arr_time_leave, arr_time_leave_total } = await fetchDataLeave(
    currentUserData?.user_key
  );
  
  const ComponentLeavePage = dynamic(
    () => import("@/app/ui/dashboard/leave/leave"),
    { ssr: false, loading: () => <Loading />}
  );

  return (
    <div className="mt-3">
      <ComponentLeavePage
        arr_time_leave={arr_time_leave}
        data_time_leave_total={arr_time_leave_total}
        dataUserName={user.username}
        dataAllUser={dataAllUser}
      />
    </div>
  );
};

export default Page;

"use server";

import { auth } from "@/app/auth";
import dynamic from "next/dynamic";
import Loading from "@/app/ui/dashboard/loading/loading";
import { getAllDataUser, getUserIssues } from "@/app/lib/fetchApi";
import Unauthorized from "@/app/ui/dashboard/unauthorized/unauthorized";
import { filterWorklogsByAuthor } from "@/app/lib/logWorkAction";

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
    } - Calendar`,
  };
}

const LogWorkCalendarPage = async ({ searchParams }) => {
  const year = searchParams?.year || new Date().getFullYear();
  const month = searchParams?.month || new Date().getMonth() + 1;

  //Get User Info
  const { user } = await auth();
  var username = searchParams?.username;
  username = username !== undefined ? username : user.username;

  const dataAllUser = await getAllDataUser();
  const dataUsers = await getUserIssues(username, year, month);

  if (dataUsers === "Unauthorized!") {
    return <Unauthorized status={"Unauthorized!"} />;
  }
  if (dataUsers === "fetch failed" || dataAllUser === "fetch failed") {
    return <Unauthorized status={"fetch failed"} />;
  }

  const userLogwork = await filterWorklogsByAuthor(
    dataUsers.issues,
    username,
    month,
    year
  );

  const ComponentCalendar = dynamic(
    () => import("@/app/ui/dashboard/logwork/logwork"),
    { ssr: false, loading: () => <Loading /> }
  );

  return (
    <>
      <ComponentCalendar
        dataUsers={dataUsers}
        dataIssue={userLogwork}
        dataAllUser={dataAllUser}
        dataUserName={user.username}
      />
    </>
  );
};

export default LogWorkCalendarPage;

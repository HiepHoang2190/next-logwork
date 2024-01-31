"use server";

import { auth } from "@/app/auth";
import dynamic from "next/dynamic";
import Loading from "@/app/ui/dashboard/loading/loading";
import { getAllDataUser, getUserIssues } from "@/app/lib/fetchApi";
import Unauthorized from "@/app/ui/dashboard/unauthorized/unauthorized";
import {
  lastDayOfMonth,
  filterWorklogsByAuthor,
} from "@/app/lib/logWorkAction";

export async function generateMetadata({ searchParams }) {
  const { user } = await auth();
  const dataAllUser = await getAllDataUser();
  const monthTitles = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthIndex = searchParams?.month - 1 || new Date().getMonth();
  const monthTitle = monthTitles[monthIndex];

  return {
    title: `${
      searchParams?.username
        ? dataAllUser
            .filter((item) => item.user_name === searchParams?.username)
            .map((user) => user.display_name)
        : user.displayName
    } - Logwork ${monthTitle}`,
  };
}

const LogWorksPage = async ({ searchParams }) => {
  const year = searchParams?.year || new Date().getFullYear();
  const month = searchParams?.month || new Date().getMonth() + 1;

  //Fetch Data
  const { user } = await auth();
  var username = searchParams?.username;
  username = username !== undefined ? username : user.username;

  const dataAllUser = await getAllDataUser();
  const dataUsers = await getUserIssues(
    username,
    year,
    month,
    lastDayOfMonth(year, month)
  );

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

  const ComponentLogWorkTablePage = dynamic(
    () => import("@/app/ui/dashboard/logwork/logworkTable"),
    { ssr: false, loading: () => <Loading /> }
  );

  return (
    <>
      <ComponentLogWorkTablePage
        user={user}
        username={username}
        dataAllUser={dataAllUser}
        dataIssue={userLogwork}
        month={month}
        year={year}
      />
    </>
  );
};

export default LogWorksPage;

"use server";

import { getCurrentUserData, getAllDataUser } from "@/app/lib/fetchApi";
import LogWorkTablePage from "@/app/ui/dashboard/logwork/logworkTable";

export async function generateMetadata({ searchParams }) {
  const currentUser = await getCurrentUserData();
  
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
        : currentUser.displayName
    } - Logwork ${monthTitle}`,
  };
}

const LogWorksPage = async ({ searchParams }) => {

  return (
    <LogWorkTablePage searchParams={searchParams}/>
  );
};

export default LogWorksPage;
"use server";

import { auth } from "@/app/auth";
import dynamic from "next/dynamic";
import Loading from "@/app/ui/dashboard/loading/loading";
import { getAllDataUser } from "@/app/lib/fetchApi";

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
  
  const ComponentCalendar = dynamic(
    () => import("@/app/ui/dashboard/logwork/logwork"),
    { ssr: false, loading: () => <Loading /> }
  );

  return (
    <>
      <ComponentCalendar searchParams={searchParams} />
    </>
  );
};

export default LogWorkCalendarPage;

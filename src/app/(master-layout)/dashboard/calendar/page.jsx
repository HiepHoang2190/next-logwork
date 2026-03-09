export const dynamic = "force-dynamic";

import { getAllDataUser, getCurrentUserData } from "@/app/lib/fetchApi";
import ComponentCalendar from "@/app/ui/dashboard/logwork/logwork";

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
    } - Calendar`,
  };
}

const LogWorkCalendarPage = async ({ searchParams }) => {

  return (
    <>
      <ComponentCalendar searchParams={searchParams} />
    </>
  );
};

export default LogWorkCalendarPage;

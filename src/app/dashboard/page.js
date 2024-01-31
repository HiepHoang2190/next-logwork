"use server";
import { auth } from "@/app/auth";
import dynamic from "next/dynamic";
import Loading from "@/app/ui/dashboard/loading/loading";
import styles from "@/app/ui/dashboard/dashboard.module.css";
import Unauthorized from "@/app/ui/dashboard/unauthorized/unauthorized";
import { getUserCurrentIssues } from "@/app/lib/fetchApi";

export async function generateMetadata() {
  const { user } = await auth();
  return {
    title: `${user.displayName} - Dashboard`,
  };
}

const Dashboard = async () => {
  //Get data Issues for current User
  const currentData = await getUserCurrentIssues();

  if (currentData === "Unauthorized!") {
    return <Unauthorized status={"Unauthorized!"} />;
  }
  if (currentData === "fetch failed") {
    return <Unauthorized status={"fetch failed"} />;
  }

  if (currentData) {
    const mappedArray = currentData.issues.map((obj) => {
      const {
        fields: { created, issuetype, summary, reporter, status, priority },
        key,
      } = obj;

      return {
        created,
        issuetype: issuetype.name,
        issuetypeicon: issuetype.iconUrl,
        prioritytype: priority.name,
        priorityicon: priority.iconUrl,
        issuestatus: status.name,
        summary: summary,
        key: key,
        reporter: reporter.displayName,
      };
    });

    const ComponentOpenTickets = dynamic(
      () => import("@/app/ui/dashboard/openTickets/openTicket"),
      { ssr: false, loading: () => <Loading />}
    );

    return (
      <div className={styles.main}>
        <h1 className={styles.title}>Open Issues</h1>
        <ComponentOpenTickets dataIssue={mappedArray} />
      </div>
    );
  } else {
    return (
      <div className={styles.main}>
        <h1 className={styles.titleNoIssues}>No Issues Found</h1>
        <img
          className={styles.imgNoIssues}
          alt="no-issues-img"
          src="/no-issues.jpg"
          width={900}
        />
      </div>
    );
  }
};

export default Dashboard;

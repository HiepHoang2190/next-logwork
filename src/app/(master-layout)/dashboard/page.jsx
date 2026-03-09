export const dynamic = "force-dynamic";

import { getCurrentUserData } from "@/app/lib/fetchApi";
import styles from "@/app/ui/dashboard/dashboard.module.css";
import ComponentOpenTickets from "@/app/ui/dashboard/openTickets/openTicket";

export async function generateMetadata() {
  const currentUser = await getCurrentUserData();

  return {
    title: `${currentUser.displayName} Logwork Dashboard`,
    description: "Logwork page by Lotus Outsourcing",
  };
}

const Dashboard = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Open Issues</h1>
      <ComponentOpenTickets />
    </div>
  );
};

export default Dashboard;

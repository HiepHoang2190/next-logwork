"use client";

import styles from "@/app/ui/dashboard/dashboard.module.css";
import ComponentOpenTickets from "@/app/ui/dashboard/openTickets/openTicket";

const Dashboard = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Open Issues</h1>
      <ComponentOpenTickets />
    </div>
  );
};

export default Dashboard;

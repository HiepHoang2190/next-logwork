"use client";

import styles from "@/app/ui/dashboard/dashboard.module.css";
import Unauthorized from "@/app/ui/dashboard/unauthorized/unauthorized";
import { getUserCurrentIssues } from "@/app/lib/fetchApi";
import { useAuth } from "@/app/lib/AuthContext";
import ComponentOpenTickets from "@/app/ui/dashboard/openTickets/openTicket";
import { useEffect, useState } from "react";
import Loading from "./loading";


const Dashboard = async () => {
  
    return (
      <div className={styles.main}>
        <h1 className={styles.title}>Open Issues</h1>
        <ComponentOpenTickets />
      </div>
    );
};

export default Dashboard;

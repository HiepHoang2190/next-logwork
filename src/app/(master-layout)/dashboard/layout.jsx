"use client";

import Navbar from "@/app/ui/dashboard/navbar/navbar";
import Sidebar from "@/app/ui/dashboard/sidebar/sidebar";
import styles from "@/app/ui/dashboard/dashboard.module.css";
import Loading from "@/app/ui/dashboard/loading/loading";
import { useAuth } from "@/app/lib/AuthContext";
import Cookies from "js-cookie";
import { useEffect } from "react";
export const dynamic = 'force-dynamic';

const Layout = ({ children }) => {

  const token = Cookies.get("JSESSIONID");
  const {refreshToken} = useAuth();

  useEffect(() => {
    if (token) {
      refreshToken(token);
    }
  }, []);

  return (
      <div className={styles.container} >
        <div className={styles.menu}>
          <Sidebar />
        </div>
        <div className={styles.content}>
          <Navbar />
          <div className={styles.contentDashboard} fallback={<Loading />}>
            <div className={styles.wrapper}>{children}</div>
          </div>
        </div>
      </div >
  );
};

export default Layout;

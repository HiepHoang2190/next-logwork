"use client";

import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {pathname.split("/").pop() === "dashboard"
          ? "Dashboard"
          : pathname.split("/").pop() === "calendar"
          ? "Logwork Calendar"
          : pathname.split("/").pop() === "report"
          ? "Logwork Report"
          : pathname.split("/").pop() === "leave"
          ? "Annual Leave"
          : ""}
      </div>
    </div>
  );
};

export default Navbar;

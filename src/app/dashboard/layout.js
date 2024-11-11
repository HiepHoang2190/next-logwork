import Navbar from "@/app/ui/dashboard/navbar/navbar";
import Sidebar from "@/app/ui/dashboard/sidebar/sidebar";
import styles from "@/app/ui/dashboard/dashboard.module.css";
import Loading from "./loading";

export const metadata = {
  title: "Lotus's Logwork Dashboard",
  description: "Logwork page by Lotus Outsourcing",
};

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar />
        <div className={styles.contentDashboard} fallback={<Loading />}>
          <div className={styles.wrapper}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

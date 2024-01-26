import Navbar from '../ui/dashboard/navbar/navbar'
import Sidebar from '../ui/dashboard/sidebar/sidebar'
import styles from '../ui/dashboard/dashboard.module.css'

export const metadata = {
  title: "Lotus's Logwork Dashboard",
  description: "Logwork page by Lotus Outsourcing",
}

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar />
        <div className={styles.contentDashboard}>
          <div className={styles.wrapper}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
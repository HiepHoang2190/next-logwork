import Image from 'next/image'
import styles from './sidebar.module.css'
import MenuLink from './menuLink/menuLink'
import { auth, signOut } from '@/app/auth'
import { MdDashboard, MdLogout } from 'react-icons/md'
import { FaUsers } from "react-icons/fa6";
import { LuCalendarCheck, LuCalendarX2 } from "react-icons/lu";

const menuItems = [
  {
    title: 'Pages',
    list: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <MdDashboard />
      },
      {
        title: 'Logwork Calendar',
        path: '/dashboard/calendar',
        icon: <LuCalendarCheck />
      },
      {
        title: 'Logwork Report',
        path: '/dashboard/report',
        icon: <FaUsers />
      },
      {
        title: 'Annual Leave',
        path: '/dashboard/leave',
        icon: <LuCalendarX2 />
      }

    ]
  },
  {
    title: 'User',
    list: [

    ]
  }
]
const Sidebar = async () => {
  const { user } = await auth()

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src={user.avatarUrls !== undefined ? user.avatarUrls[0] : '/noavatar.png'}
          alt=""
          width="50"
          height="50"
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>{user.displayName}</span>
          {/* <span className={styles.userTitle}>Administrator</span> */}
        </div>
      </div>
      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      <form
        action={async () => {
          'use server'
          await signOut()
        }}
      >
        <button className={styles.logout}>
          <MdLogout />
          Logout
        </button>
      </form>
    </div>
  )
}

export default Sidebar
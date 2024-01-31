import Image from "next/image";
import styles from "./sidebar.module.css";
import MenuLink from "./menuLink/menuLink";
import { auth, signOut } from "@/app/auth";
import { MdDashboard, MdLogout } from "react-icons/md";
import { LuCalendarCheck, LuCalendarX2 } from "react-icons/lu";

const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Logwork Calendar",
        path: "/dashboard/calendar",
        icon: <LuCalendarCheck />,
      },
      {
        title: "Logwork Report",
        path: "/dashboard/report",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
          >
            <path
              d="M2.5 12.1667L2.91667 12.225L6.725 8.41667C6.64859 8.13683 6.64848 7.84165 6.72468 7.56176C6.80088 7.28187 6.95061 7.02748 7.15833 6.825C7.80833 6.16667 8.85833 6.16667 9.50833 6.825C9.95 7.25833 10.0917 7.875 9.94167 8.41667L12.0833 10.5583L12.5 10.5C12.65 10.5 12.7917 10.5 12.9167 10.5583L15.8917 7.58333C15.8333 7.45833 15.8333 7.31667 15.8333 7.16667C15.8333 6.72464 16.0089 6.30072 16.3215 5.98816C16.634 5.67559 17.058 5.5 17.5 5.5C17.942 5.5 18.3659 5.67559 18.6785 5.98816C18.9911 6.30072 19.1667 6.72464 19.1667 7.16667C19.1667 7.60869 18.9911 8.03262 18.6785 8.34518C18.3659 8.65774 17.942 8.83333 17.5 8.83333C17.35 8.83333 17.2083 8.83333 17.0833 8.775L14.1083 11.75C14.1667 11.875 14.1667 12.0167 14.1667 12.1667C14.1667 12.6087 13.9911 13.0326 13.6785 13.3452C13.3659 13.6577 12.942 13.8333 12.5 13.8333C12.058 13.8333 11.634 13.6577 11.3215 13.3452C11.0089 13.0326 10.8333 12.6087 10.8333 12.1667L10.8917 11.75L8.75 9.60833C8.48333 9.66667 8.18333 9.66667 7.91667 9.60833L4.10833 13.4167L4.16667 13.8333C4.16667 14.2754 3.99107 14.6993 3.67851 15.0118C3.36595 15.3244 2.94203 15.5 2.5 15.5C2.05797 15.5 1.63405 15.3244 1.32149 15.0118C1.00893 14.6993 0.833332 14.2754 0.833332 13.8333C0.833332 13.3913 1.00893 12.9674 1.32149 12.6548C1.63405 12.3423 2.05797 12.1667 2.5 12.1667Z"
              fill="white"
            />
          </svg>
        ),
      },
      {
        title: "Annual Leave",
        path: "/dashboard/leave",
        icon: <LuCalendarX2 />,
      },
    ],
  },
  {
    title: "User",
    list: [],
  },
];
const Sidebar = async () => {
  const { user } = await auth();

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img alt="lotus-logo" src="/jira-logo.png" />
      </div>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src={
            user.avatarUrls !== undefined ? user.avatarUrls[0] : "/noavatar.png"
          }
          alt="avatar"
          width="50"
          height="50"
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>{user.displayName}</span>
          <span className={styles.userTitle}>{user.email}</span>
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
          "use server";
          await signOut();
        }}
      >
        <button className={styles.logout}>
          <MdLogout />
          Logout
        </button>
      </form>
    </div>
  );
};

export default Sidebar;

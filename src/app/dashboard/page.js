'use server'
import { auth } from '@/app/auth'
import styles from '../ui/dashboard/dashboard.module.css'
import OpenTickets from '../ui/dashboard/openTickets/openTicket'
import Unauthorized from '@/app/ui/dashboard/unauthorized/unauthorized'
import { getAllDataUser, getUserCurrentIssues } from '@/app/lib/fetchApi'

export async function generateMetadata({ searchParams }) {
  const { user } = await auth()
  const dataAllUser = await getAllDataUser();

  return {
    title: `${searchParams?.username ?
      (dataAllUser.filter(item => (item.user_name === searchParams?.username)).map(user => user.display_name))
      :
      (user.displayName)
      } - Dashboard`,
  }
}

const Dashboard = async () => {

  //Get data Issues for current User
  const currentData = await getUserCurrentIssues();

  if (currentData === "Unauthorized!") {
    return <Unauthorized status={"Unauthorized!"}/>
  }
  if (currentData === "fetch failed") {
    return <Unauthorized status={"fetch failed"}/>
  }

  if (currentData) {

    const mappedArray = currentData.map((obj) => {

      const { fields: { created, issuetype, summary, reporter, status, priority }, key } = obj;

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

    return (
      <div className={styles.main}>
        <h1 className={styles.title}>Open Issues</h1>
        <OpenTickets dataIssue={mappedArray} />
      </div>
    )
  } else {
    return (
      <div className={styles.main}>
        <h1 className={styles.titleNoIssues}>No Issues Found</h1>
        <img className={styles.imgNoIssues} alt="no-issues-img" src="/no-issues.jpg" width={900}/>
      </div>
    )
  }
}

export default Dashboard
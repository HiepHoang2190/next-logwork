'use server'
import { auth } from '@/app/auth'
import styles from '../ui/dashboard/dashboard.module.css'
import OpenTickets from '../ui/dashboard/openTickets/openTicket'
import { getUserCurrentTask, getAllDataUser } from '@/app/lib/fetchApi'

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

  const { user } = await auth()
  const username = user.username

  //Get data Issues for current User
  const dataAllUser = await getAllDataUser();
  const currentUserData = dataAllUser.find(data => data.user_name === username)
  const dataIssue = await getUserCurrentTask(currentUserData.user_key);
  
  //Filter dataIssue to get only working status, 1: Open, 3: In Progress, 4: Reopened, 10103: Request Created
  const workingStatuses = ['1', '3', '4', '10103'];

  //Map dataAllUser to filter
  const userMapping = dataAllUser.reduce((acc, user) => {
    acc[user.user_key] = user.display_name;
    return acc;
  }, {});

  //Re-map dataIssue, replace user_key with display_name
  const mappedIssues = dataIssue.map(issue => ({
    ...issue,
    author: userMapping[issue.author],
    reporter: userMapping[issue.reporter]
  }));

  //Filter issues by working statuses
  const filteredIssues = mappedIssues.filter(issue => workingStatuses.includes(issue.issuestatus));

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <h1 className={styles.title}>Open Issues</h1>
        <OpenTickets dataIssue={filteredIssues} />
      </div>
    </div>
  )
}

export default Dashboard
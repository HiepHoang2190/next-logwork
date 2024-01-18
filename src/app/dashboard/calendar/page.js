import { auth } from '@/app/auth'
import LogWorksUi from '@/app/ui/dashboard/logwork/logwork'
import { getAllDataUser, getUserIssues, getWorklogCurrentIssue } from '@/app/lib/fetchApi'
import { filterWorklogsByAuthor, lastDayOfMonth } from '@/app/lib/logWorkAction'

export async function generateMetadata({ searchParams }) {
  const { user } = await auth()
  const dataAllUser = await getAllDataUser();

  return {
    title: `${searchParams?.username ?
      (dataAllUser.filter(item => (item.user_name === searchParams?.username)).map(user => user.display_name))
      :
      (user.displayName)
      } - Calendar`,
  }
}


const LogWorkCalendarPage = async ({ searchParams }) => {

  const { user } = await auth()
  var username = searchParams?.username
  username = (username !== undefined) ? username : user.username

  //Get data Issues for current User
  const dataAllUser = await getAllDataUser();

  const year = searchParams?.year || new Date().getFullYear();
  const month = searchParams?.month || new Date().getMonth() + 1;

  //Fetch Data issues log work of user
  const dataUsers = await getUserIssues(username, year, month, lastDayOfMonth(year, month))

  const userLogwork = await filterWorklogsByAuthor(dataUsers, username, month, year);

  return (
    <>
      <LogWorksUi dataUsers={dataUsers} dataIssue={userLogwork} dataAllUser={dataAllUser} dataUserName={user.username} />
    </>
  )
}

export default LogWorkCalendarPage
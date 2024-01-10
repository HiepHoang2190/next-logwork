import LogWorksUi from '../../ui/dashboard/logwork/logwork'
import { auth } from '@/app/auth'
import { getUserIssue, getAllDataUser } from '@/app/lib/fetchApi'

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
  const currentUserData = dataAllUser.find(data => data.user_name === username)
  const dataIssue = await getUserIssue(currentUserData.user_key);

  return (
    <>
      <LogWorksUi dataIssue={dataIssue} dataAllUser={dataAllUser} dataUserName={user.username} />
    </>
  )
}

export default LogWorkCalendarPage
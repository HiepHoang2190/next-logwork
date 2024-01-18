'use server'
import { auth } from '@/app/auth'
import { getAllDataUser, getUserIssues } from '@/app/lib/fetchApi'
import LogWorkTablePage from '@/app/ui/dashboard/logwork/logworkTable'
import LogWorkExcelPage from '@/app/ui/dashboard/logwork/logworkExcel'
import LogWorkDatePicker from '@/app/ui/dashboard/logwork/logworkDatePicker'
import { lastDayOfMonth, filterWorklogsByAuthor } from '@/app/lib/logWorkAction'

export async function generateMetadata({ searchParams }) {
  const { user } = await auth()
  const dataAllUser = await getAllDataUser();
  const monthTitles = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthIndex = (searchParams?.month - 1 || new Date().getMonth());
  const monthTitle = monthTitles[monthIndex];

  return {
    title: `${searchParams?.username ?
      (dataAllUser.filter(item => (item.user_name === searchParams?.username)).map(user => user.display_name))
      :
      (user.displayName)
      } - Logwork ${monthTitle}`,
  }
}

const LogWorksPage = async ({ searchParams }) => {

  //Get User Info
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
      <div className='wrapper-datetime'>
        <LogWorkDatePicker />
        <LogWorkExcelPage username={username} month={month} year={year} dataAllUser={dataAllUser} dataUserName={user.username} />
      </div>

      <LogWorkTablePage dataIssue={userLogwork} month={month} year={year} />
    </>
  )
}

export default LogWorksPage
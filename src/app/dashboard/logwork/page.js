import LogWorkDatePicker from '../../ui/dashboard/logwork/logworkDatePicker'
import LogWorkTablePage from '../../ui/dashboard/logwork/logworkTable'
import LogWorkExcelPage from '../../ui/dashboard/logwork/logworkExcel'
import LogWorksUi from '../../ui/dashboard/logwork/logwork'
import { auth } from '@/app/auth'
import { getUserIssue, getAllDataUser } from '@/app/lib/actions'

export async function generateMetadata({ searchParams }) {
  const { user } = await auth()
  const dataAllUser = await getAllDataUser();

  return {
    title: `${searchParams?.username ?
      (dataAllUser.filter(item => (item.user_name === searchParams?.username)).map(user => user.display_name))
      :
      (user.displayName)
      } - Logwork tháng ${searchParams?.month || new Date().getMonth() + 1}`,
  }
}


const LogWorksPage = async ({ searchParams }) => {

  const { user } = await auth()

  var username = searchParams?.username

  username = (username !== undefined) ? username : user.username

  const dataIssue = await getUserIssue(username);
  const dataAllUser = await getAllDataUser();

  const month = searchParams?.month || new Date().getMonth() + 1;
  const year = searchParams?.year || new Date().getFullYear();

  return (
    <>
      <div className='wrapper-datetime'>
        <LogWorkDatePicker />
        <LogWorkExcelPage username={username} month={month} year={year} />
      </div>

      <LogWorkTablePage dataIssue={dataIssue} month={month} year={year} />

      <LogWorksUi dataIssue={dataIssue} dataAllUser={dataAllUser} dataUserName={user.username} />
    </>
  )
}

export default LogWorksPage
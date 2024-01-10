'use server'
import { auth } from '@/app/auth'
import { getUserIssue, getAllDataUser} from '@/app/lib/fetchApi'
import LogWorkTablePage from '../../ui/dashboard/logwork/logworkTable'
import LogWorkExcelPage from '../../ui/dashboard/logwork/logworkExcel'
import LogWorkDatePicker from '../../ui/dashboard/logwork/logworkDatePicker'


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
  
  //Get data Issues for current User
  const dataAllUser = await getAllDataUser();
  const currentUserData = dataAllUser.find(data => data.user_name === username)
  const dataIssue = await getUserIssue(currentUserData.user_key);

  const year = searchParams?.year || new Date().getFullYear();
  const month = searchParams?.month || new Date().getMonth() + 1;

  return (
    <>
      <div className='wrapper-datetime'>
        <LogWorkDatePicker />
        <LogWorkExcelPage username={username} month={month} year={year} dataAllUser={dataAllUser} dataUserName={user.username}/>
      </div>

      <LogWorkTablePage dataIssue={dataIssue} month={month} year={year} />
    </>
  )
}

export default LogWorksPage
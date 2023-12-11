import LogWorkDatePicker from '../../ui/dashboard/logwork/logworkDatePicker'
import LogWorkTablePage from '../../ui/dashboard/logwork/logworkTable'
import LogWorkExcelPage from '../../ui/dashboard/logwork/logworkExcel'
import LogWorksUi from '../../ui/dashboard/logwork/logwork'
import { auth } from '@/app/auth'

const LogWorksPage = async ({ searchParams }) => {

  const { user } = await auth()

  var username = searchParams?.username

  username = (username !== undefined) ? username : user.username

  const fetchData = async (url) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'X-CSRF-Token'
      }
    });

    const data = await response.json();
    return data;
  };

  const getUserIssue = async (username) => {
    const url = `${process.env.API_PATH}/V1/user/${username}`;
    const data = await fetchData(url);
    const arr = []
    data.map((item) => (
      arr.push(item)
    ));
    return arr
  };

  const getAllDataUser = async () => {
    const url = `${process.env.API_PATH}/V1/all-user`;
    const data = await fetchData(url);
    const arr = []
    data.map((item) => (
      arr.push(item)
    ));
    return arr
  };

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

      <LogWorksUi dataIssue = {dataIssue} dataAllUser={dataAllUser} dataUserName={user.username} />
    </>
  )
}

export default LogWorksPage
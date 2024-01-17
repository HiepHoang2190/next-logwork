'use server'
import { auth } from '@/app/auth'
import { getAllDataUser, getUserIssues, getWorklogCurrentIssue } from '@/app/lib/fetchApi'
import LogWorkTablePage from '@/app/ui/dashboard/logwork/logworkTable'
import LogWorkExcelPage from '@/app/ui/dashboard/logwork/logworkExcel'
import LogWorkDatePicker from '@/app/ui/dashboard/logwork/logworkDatePicker'
import { formatTime, lastDayOfMonth } from '@/app/lib/logWorkTableAction'

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

  const { user } = await auth()
  const dataAllUser = await getAllDataUser()

  var username = searchParams?.username
  username = (username !== undefined) ? username : user.username

  const year = searchParams?.year || new Date().getFullYear();
  const month = searchParams?.month || new Date().getMonth() + 1;

  //Fetch Data issues log work of user

  const dataUsers = await getUserIssues(username, year, month, lastDayOfMonth(year, month))

  const filterWorklogsByAuthor = async (data, authorName) => {
    
    const newData = await Promise.all(
      data.map(async (item) => {
        // Check if worklog total is greater than 20
        if (item.fields.worklog.total > 20) {
          try {
            // Call API getWorklogCurrentIssue(key) to get all worklogs
            const additionalWorklogs = await getWorklogCurrentIssue(item.key);
  
            // Merge additional worklogs with existing worklogs
            item.fields.worklog.worklogs = [
              ...item.fields.worklog.worklogs,
              ...additionalWorklogs.worklogs,
            ];
          } catch (error) {
            console.error(`Error fetching additional worklogs for ${item.key}:`, error);
          }
        }
  
        // Filter worklogs by authorName
        const filteredWorklogs = item.fields.worklog.worklogs.filter(
          (worklog) => worklog.author.name === authorName
        );
  
        // Transform and return the filtered worklogs
        return filteredWorklogs.map((filteredWorklog) => ({
          author: filteredWorklog.author.key,
          comment: filteredWorklog.comment,
          created: formatTime(filteredWorklog.created),
          startdate: formatTime(filteredWorklog.started),
          updated: formatTime(filteredWorklog.updated),
          summary: item.fields.summary,
          timeworked: filteredWorklog.timeSpentSeconds,
          key: item.key,
          pkey: item.key.split('-')[0],
        }));
      })
    );
  
    return newData.flat();
  };

  
  const userLogwork = await filterWorklogsByAuthor(dataUsers, username);

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
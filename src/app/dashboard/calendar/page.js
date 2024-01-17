import { auth } from '@/app/auth'
import LogWorksUi from '@/app/ui/dashboard/logwork/logwork'
import { getAllDataUser, getUserIssues, getWorklogCurrentIssue } from '@/app/lib/fetchApi'
import { formatTime, lastDayOfMonth } from '@/app/lib/logWorkTableAction'

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

  const filterWorklogs = (worklogs, month, year) => {
    return worklogs.filter(worklog => {
      const startedDate = new Date(worklog.started);
      const worklogMonth = startedDate.getMonth() + 1; // Month is zero-based
      const worklogYear = startedDate.getFullYear();
      
      return ( worklogMonth == month &&  worklogYear == year );
    });
  }

  const filterWorklogsByAuthor = async (data, authorName, month, year) => {
    
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
  
        // Filter worklogs by month and year
        const filterWorklogsByMonth = filterWorklogs(filteredWorklogs, month, year);
  
        // Transform and return the filtered worklogs
        return filterWorklogsByMonth.map((filteredWorklog) => ({
          author: filteredWorklog.author.key,
          comment: filteredWorklog.comment,
          created: formatTime(filteredWorklog.created),
          startdate: formatTime(filteredWorklog.started),
          updated: formatTime(filteredWorklog.updated),
          summary: item.fields.summary,
          timeworked: filteredWorklog.timeSpentSeconds,
          key: item.key,
          pkey: item.key.split('-')[0],
          issueid: item.id,
        }));
      })
    );
  
    return newData.flat();
  };

  const userLogwork = await filterWorklogsByAuthor(dataUsers, username, month, year);

  return (
    <>
      <LogWorksUi dataUsers={dataUsers} dataIssue={userLogwork} dataAllUser={dataAllUser} dataUserName={user.username} />
    </>
  )
}

export default LogWorkCalendarPage
'use server'
import { auth } from '@/app/auth'
import LeavePage from '../../ui/dashboard/leave/leave'
import { getTimeLeaveTotal, getTimeLeave, getAllDataUser } from '@/app/lib/fetchApi'

export async function generateMetadata({ searchParams }) {
  const { user } = await auth()
  const dataAllUser = await getAllDataUser();

  return {
    title: `${searchParams?.username ?
      (dataAllUser.filter(item => (item.user_name === searchParams?.username)).map(user => user.display_name))
      :
      (user.displayName)
      } - Leave Request`,
  }
}

const formatDate = (date) => [
  padTo2Digits(date.getDate()),
  padTo2Digits(date.getMonth() + 1),
  date.getFullYear()
].join('-')

const padTo2Digits = (num) => num.toString().padStart(2, '0')

const processLeaveItem = (item) => {
  const dd = item.create_date.split('-')
  const monthLeave = dd[1]
  const yearLeave = dd[0].substr(2)

  const date1 = new Date(item.create_date)
  const date2 = new Date(item.start_date)
  const date3 = new Date(item.due_date)

  const difference_in_time = date2.getTime() - date1.getTime()
  const difference_in_days = difference_in_time / (1000 * 3600 * 24)

  const createDateFormat = formatDate(date1)
  const startDateFormat = formatDate(date2)
  const dueDateFormat = formatDate(date3)

  const date = new Date()
  const currentYear = date.getFullYear().toString().substr(2)

  if (yearLeave == currentYear) {
    return {
      'creator': item.creator,
      'summary': item.summary,
      'desc': item.desc,
      'create_date': createDateFormat,
      'due_date': dueDateFormat,
      'id': item.id,
      'start_date': startDateFormat,
      'year_leave': yearLeave,
      'current_year': currentYear,
      'difference_in_days': difference_in_days
    }
  }
  return null
}

const fetchData = async (username) => {

  const data_time_leave = await getTimeLeave(username)
  const data_time_leave_total = await getTimeLeaveTotal(username)

  const arr_time_leave = data_time_leave
    .map(processLeaveItem)
    .filter(item => item !== null)

  const arr_time_leave_total = [...data_time_leave_total]

  return { arr_time_leave, arr_time_leave_total }
}

const Page = ({ searchParams }) => {
  
  const fetchDataAndRender = async () => {

    //Get User Info
    const { user } = await auth()
    var username = searchParams?.username
    username = (username !== undefined) ? username : user.username

    //Get data leave request for current User
    const dataAllUser = await getAllDataUser();
    const currentUserData = dataAllUser.find(data => data.user_name === username)
    const { arr_time_leave, arr_time_leave_total } = await fetchData(currentUserData?.user_key)

    return (
      <div className="mt-3">
        <LeavePage arr_time_leave={arr_time_leave} data_time_leave_total={arr_time_leave_total} dataUserName={user.username} dataAllUser={dataAllUser} ></LeavePage>
      </div>
    )
  }
  return fetchDataAndRender()
}

export default Page

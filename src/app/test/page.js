import { auth, signOut } from '@/app/auth'
import { dataleave, dataleavetotal } from '@/app/lib/datasource'


import LeavePage2 from '../test/uitest'
const Page = async () => { {

  const { user } = await auth()
  const getTimeLeaveTotal = async () => {
    'use server'
    const arr=[]
    const totalTimeLive = await
    fetch(`http://api-jira.lotustest.net/rest/V1/timeleave/${user.username}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':'*',
          'Access-Control-Allow-Credentials':'true',
          'Access-Control-Allow-Headers':'X-CSRF-Token'


        }
      })
      .then(response => response.json())
      .then(data => {
        data.map((item) => (
          arr.push(item)
        ))

      })

    return arr
  }
  const getTimeLeave = async () => {
    'use server'
    const arr=[]
    const typeLeave = await
    fetch(`http://api-jira.lotustest.net/rest/V1/leave/${user.username}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':'*',
          'Access-Control-Allow-Credentials':'true',
          'Access-Control-Allow-Headers':'X-CSRF-Token'


        }
      })
      .then(response => response.json())
      .then(data => {
        // console.log('data2',data)
        data.map((item) => (
          arr.push(item)
        ))


      })

    return arr
  }

  const handleForm = async (formData) => {
    'use server'
    console.log(formData)
    const username = formData.get('username')
    // console.log('Hello', username)
  }

  const data_time_leave = await getTimeLeave()
  const data_time_leave_total = await getTimeLeaveTotal()
  // console.log('data',data)
  const arr_time_leave= []
  const arr_time_leave_total= []

  data_time_leave.map((item) => {

    const dd = item.create_date.split('-')

    const monthLeave = dd[1]
    const yearLeave = dd[0].substr(2)
    const createDate = item.create_date.split(' ')
    const startDate = item.start_date.split(' ')
    const dueDate = item.due_date.split(' ')

    const date1 = new Date(item.create_date)
    const date2 = new Date(item.start_date)
    const date3 = new Date(item.due_date)

    const difference_in_time = date2.getTime() - date1.getTime()
    const difference_in_days = difference_in_time / (1000 * 3600 * 24)

    function formatDate(date) {
      return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear()
      ].join('-')
    }

    function padTo2Digits(num) {
      return num.toString().padStart(2, '0')
    }

    const createDateFormat = formatDate(date1)
    const startDateFormat = formatDate(date2)
    const dueDateFormat = formatDate(date3)

    const date = new Date()
    const currentYear = date.getFullYear().toString().substr(2)
    if (yearLeave == currentYear) {
      arr_time_leave.push({
        'creator': item.creator,
        'summary': item.summary,
        'desc': item.desc,
        'create_date': createDateFormat,
        'due_date': dueDateFormat,
        'id':  item.id,
        'start_date': startDateFormat,
        'year_leave':yearLeave,
        'current_year': currentYear,
        'difference_in_days':difference_in_days
      })
    }
  })

  data_time_leave_total.map((item) => (
    arr_time_leave_total.push(item)
  ))
  return (
    <div>
      <form action={handleForm}>
        <input type="text" placeholder="username" name="username" />
        <input type="password" placeholder="password" name="password" />
        <button>Send</button>
      </form>
      <div className="mt-3">
        <LeavePage2 arr_time_leave={arr_time_leave} data_time_leave_total={data_time_leave_total} ></LeavePage2>
      </div>

    </div>
  )
}}

export default Page
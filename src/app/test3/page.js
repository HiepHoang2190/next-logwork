
'use server'
import { auth } from '@/app/auth'

const PageTest = async () => {

  const { user } = await auth()
  const getUserIssue = async () => {
    'use server'
    const arr=[]
    const totalTimeLive = await
    fetch(`http://api-jira.lotustest.net/rest/V1/user/${user.username}`,
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

  const dataIssue = await getUserIssue()
  let issue_list = []


  issue_list = dataIssue.filter(function(el) {
    var month = 10
    month = (month !== undefined) ? month : new Date().getMonth() + 1
    var createDate = el.STARTDATE.substring(0, 10)
    var monthLog = new Date(createDate).getMonth() + 1
    var yearLog = new Date(createDate).getFullYear().toString().substr(-2)
    var yearRequest = 23
    yearRequest = (yearRequest !== undefined) ? yearRequest : new Date().getFullYear().toString().substr(-2)
    return monthLog == month && yearLog == yearRequest
  })


  let arr_group = []
  issue_list.forEach(value => {
    // Extract the day from the STARTDATE using JavaScript's Date object
    let logDay = new Date(value.STARTDATE).getDate().toString()

    // Check if the key exists in the arr_group
    if (arr_group[value.key]) {
      // Check if the logDay exists in the logs arr_group
      if (arr_group[value.key].logs[logDay]) {
        // If logDay exists, add the timeworked to the existing value
        arr_group[value.key].logs[logDay].timeworked += value.timeworked
      } else {
        // If logDay does not exist, create a new entry in the logs arr_group
        arr_group[value.key].logs[logDay] = {
          comment: value.comment,
          timeworked: value.timeworked,
          created: value.STARTDATE
        }
      }
    } else {
      // If the key does not exist, create a new entry in the arr_group
      arr_group[value.key] = {
        key: value.key,
        pkey: value.pkey,
        summary: value.SUMMARY,
        logs: {
          [logDay]: {
            comment: value.comment,
            timeworked: value.timeworked,
            created: value.STARTDATE
          }
        }
      }
    }
  })

  let year = 2023
  let month = 10
  let today = new Date().toISOString().slice(0, 10).replace(/-/g, '/')
  let current = new Date().getDate()
  let stringMaY = new Date().toISOString().slice(5, 7) + '/' + new Date().getFullYear()
  let thisyear = new Date().getFullYear()


  const arr_days = []
  const arr_days_tbody = []
  let days = new Date(thisyear, month, 0).getDate()
  let days_tbody = days + 4

  for (let i = 1; i < days; i++) {
    arr_days.push(i)
  }

  for (let i = 1; i < days_tbody; i++) {
    arr_days_tbody.push(i)
  }

  console.log('arr_days', arr_days)
  console.log('arr_days_tbody', arr_days_tbody)

  function getDatefromDay(day, thismonth, thisyear) {
    let fullday = thismonth + '/' + day + '/' + thisyear
    let dt = new Date(fullday)
    // console.log('fullday', fullday)
    // console.log('dttttt', dt)
    // console.log('getday', dt.getDay())
    let days = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')
    return days[dt.getDay()].toUpperCase().slice(0, 2)
  }
  let t = getDatefromDay(2, 10, 2023)
  // console.log('today',today)
  // console.log('current',current)
  // console.log('stringMaY',stringMaY)
  // console.log('thisyear',thisyear)
  // console.log('days',days)
  console.log('ttttt', t)
  // console.log('issue_list', issue_list)
  console.log('arr_group', arr_group)

  return (
    <>
      <div>

        <table id="content-bottom">
          <thead>
            <tr>
              <th style={{ textAlign: 'left', width: 500, fontWeight: 700 }}>Issue</th>
              <th style={{ width: 75, fontWeight: 700 }}>Key</th>
              <th style={{ width: 75, fontWeight: 700 }}>Projects</th>
              <th style={{ width: 75, fontWeight: 700 }}>Log Time</th>
              {
                arr_days.map((item) => (
                  (item < 10)
                    ? (
                      <th className={(item == current && new Date().getMonth() + 1 == month && new Date().getFullYear() == year) ?'current date' : 'date'} id={(getDatefromDay(item, month, thisyear) === 'SA' || getDatefromDay(item, month, thisyear) === 'SU') ? 'weekend' : ''} key={item} ><strong>{'0'+item}</strong><br />{getDatefromDay(item, month, thisyear)}</th>
                    )
                    : (
                      <th className={(item == current && new Date().getMonth() + 1 == month && new Date().getFullYear() == year) ? 'current date' : 'date'} d={(getDatefromDay(item, month, thisyear) === 'SA' || getDatefromDay(item, month, thisyear) === 'SU') ? 'weekend' : ''} key={item} ><strong>{item}</strong><br />{getDatefromDay(item, month, thisyear)}</th>
                    )
                ))
              }
            </tr>
          </thead>
          <tbody>
            {
              Object
                .keys(arr_group).map((index) => (

                  <tr key={index}>
                    {arr_days_tbody.map((element, ind) => {
                      if (element === 1) {
                        return <td key={ind}><a target="_blank" rel="noreferrer" href="https://jira.lotustest.net/browse/" className="title">{arr_group[index].summary}</a></td>
                      } else if (element === 2) {
                        return <td key={ind}>{arr_group[index].key}</td>
                      } else if (element === 3) {
                        return <td key={ind}>{arr_group[index].pkey}</td>
                      } else if (element === 4) {
                        // return <td key={ind}>{() => (arr_group[index].logs.reduce(function(a, b) {
                        //   return a + (b['timeworked'] / 3600).toFixed(2)
                        // }, 0) + 'h')}</td>
                        return <td key={ind}>test11</td>
                      } else {
                        return <td key={ind}>test</td>
                      }

                    })}
                  </tr>
                ))
            }

            <tr className="last">
              <td colSpan={3}>Total</td>
              <td className="total">h</td></tr>
          </tbody>
        </table>
      </div>

    </>

  )
}

export default PageTest
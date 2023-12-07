

import LogWorksUi from '../../ui/dashboard/logwork/logwork'
import { logTimeTotal, logTimeElement, logTimeTotalIssue, logTimeTotalIssueByDay } from '@/app/lib/actions'
import LogWorkTablePage from '../../ui/dashboard/logwork/logworkTable'
import { auth } from '@/app/auth'

const LogWorksPage = async ({ searchParams }) => {

  const { user } = await auth()
  var username = searchParams?.username
  username = (username !== undefined) ? username : user.username
  const getUserIssue = async () => {
    'use server'
    const arr=[]
    const totalTimeLive = await
    fetch(`http://api-jira.lotustest.net/rest/V1/user/${username}`,
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
  // console.log(dataIssue)


  var month = searchParams?.month
  var year = searchParams?.year
  month = (month !== undefined) ? month : new Date().getMonth() + 1
  year = (year !== undefined) ? year : new Date().getFullYear()
  var year_url =(year !== undefined) ? year.toString().substr(-2) : new Date().getFullYear().toString().substr(-2)

  let issue_list = []
  issue_list = dataIssue.filter(function(el) {

    var createDate = el.STARTDATE.substring(0, 10)
    var monthLog = new Date(createDate).getMonth() + 1
    var yearLog = new Date(createDate).getFullYear().toString().substr(-2)
    var yearRequest = year_url
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
        arr_group[value.key].logs[logDay].timeworked += Number(value.timeworked)
      } else {
        // If logDay does not exist, create a new entry in the logs arr_group
        arr_group[value.key].logs[logDay] = {
          comment: value.comment,
          timeworked: Number(value.timeworked),
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
            timeworked: Number(value.timeworked),
            created: value.STARTDATE
          }
        }
      }
    }
  })


  var today = new Date().toISOString().slice(0, 10).replace(/-/g, '/')
  var current = new Date().getDate()
  var stringMaY = new Date().toISOString().slice(5, 7) + '/' + new Date().getFullYear()
  var thisyear = year


  const arr_days = []
  const arr_days_tbody = []
  var days = new Date(thisyear, month, 0).getDate()
  var days_tbody = days + 4

  for (let i = 1; i < days +1; i++) {
    arr_days.push(i)
  }

  for (let i = 1; i < days_tbody +1; i++) {
    arr_days_tbody.push(i)
  }


  function getDatefromDay(day, thismonth, thisyear) {
    let fullday = thismonth + '/' + day + '/' + thisyear
    let dt = new Date(fullday)

    let days = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')
    return days[dt.getDay()].toUpperCase().slice(0, 2)
  }

  const toTalTimeIssue = logTimeTotalIssue(Object.values(arr_group))
  // console.log('dataIssue',dataIssue)
  // console.log('arr_group',arr_group)


  return (
    <>
      <div className='wrapper-datetime'>
        <LogWorkTablePage></LogWorkTablePage>
      </div>
      <div>
        <table className="log-work" id="content-bottom">
          <thead>
            <tr>
              <th style={{ textAlign: 'left', width: 500, fontWeight: 700 }}>Issue</th>
              <th style={{ width: 75, fontWeight: 700 }}>Key</th>
              <th style={{ width: 75, fontWeight: 700 }}>Projects</th>
              <th style={{ width: 75, fontWeight: 700 }}>Log Time</th>
              {
                arr_days.map((item) => {
                  if (item<10) {
                    return <th className={(item == current && new Date().getMonth() + 1 == month && new Date().getFullYear() == year) ?'current date' : 'date'} id={(getDatefromDay(item, month, thisyear) === 'SA' || getDatefromDay(item, month, thisyear) === 'SU') ? 'weekend' : ''} key={item} ><strong>{'0'+item}</strong><br />{getDatefromDay(item, month, thisyear)}</th>
                  } else {
                    return <th className={(item == current && new Date().getMonth() + 1 == month && new Date().getFullYear() == year) ? 'current date' : 'date'} id={(getDatefromDay(item, month, thisyear) === 'SA' || getDatefromDay(item, month, thisyear) === 'SU') ? 'weekend' : ''} key={item} ><strong>{item}</strong><br />{getDatefromDay(item, month, thisyear)}</th>
                  }
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              Object
                .keys(arr_group).map((index) => (

                  <tr key={index}>
                    {arr_days_tbody.map( (element, ind) => {
                      if (element === 1) {
                        return <td key={ind} className="title-issue"><a target="_blank" rel="noreferrer" href={`https://jira.lotustest.net/browse/${arr_group[index].key}`} className="title">{arr_group[index].summary}</a></td>
                      } else if (element === 2) {
                        return <td key={ind}>{arr_group[index].key}</td>
                      } else if (element === 3) {
                        return <td key={ind}>{arr_group[index].pkey}</td>
                      } else if (element === 4) {

                        const result = Object.values(arr_group[index].logs)
                        return <td key={ind}>{ logTimeTotal(result)}h</td>
                      } else if (getDatefromDay(element-4, month, thisyear) == 'SA' || getDatefromDay(element-4, month, thisyear) == 'SU') {
                        return (<td key={ind} id="weekend"></td>)
                      } else {

                        let inde = (element - 4)
                        const result2 = Object.values(arr_group[index].logs)
                        let timeworked = logTimeElement(result2, inde)

                        if (timeworked !== undefined) {
                          return <td className="timeworked" key={ind}>{timeworked}h</td>
                        } else {
                          return <td key={ind}></td>
                        }

                      }

                    })}
                  </tr>
                ))
            }

            <tr className="last">
              <td colSpan={3}>Total</td>
              <td className="total">{toTalTimeIssue}h</td>
              {
                arr_days.map((item) => {
                  const countWorkDay = logTimeTotalIssueByDay(Object.values(arr_group), item)
                  // console.log('countWorkDay', countWorkDay)
                  if (countWorkDay == 0) {
                    return (<td key={item}></td>)
                  } else {
                    return (<td key={item}>{countWorkDay} h</td>)
                  }
                }

                )
              }
            </tr>

          </tbody>
        </table>
      </div>
      <LogWorksUi dataIssue = {dataIssue} dataUserName={user.username}></LogWorksUi>
    </>

  )
}

export default LogWorksPage
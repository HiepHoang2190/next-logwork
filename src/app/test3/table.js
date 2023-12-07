'use server'
import { logTimeTotal, logTimeElement, logTimeTotalIssue, logTimeTotalIssueByDay,getDatefromDay } from '@/app/lib/actions'
import { auth } from '@/app/auth'

const TablePage = async (props) => {
  const { arr_days, arr_group, arr_days_tbody, toTalTimeIssue, year, month, today, current, stringMaY, thisyear } = props

  

  return (
    <>
      {/* <table id="content-bottom">
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
                  {arr_days_tbody.map( (element, ind) => {
                    if (element === 1) {
                      return <td key={ind}><a target="_blank" rel="noreferrer" href={`https://jira.lotustest.net/browse/${arr_group[index].key}`} className="title">{arr_group[index].summary}</a></td>
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
      </table> */}
    </>
  )
}

export default TablePage
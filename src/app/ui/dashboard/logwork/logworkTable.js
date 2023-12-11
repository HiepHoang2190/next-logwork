"use client"
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';


const LogWorkTablePage = (props) => {
  const { dataIssue, month, year } = props;
  const [dataTable, setDataTable] = useState();

  useEffect(() => {
    setDataTable(dataIssue);
  }, [dataIssue]);

  const processData = (data, year_url, month) => {
    var yearRequest = year_url || new Date().getFullYear().toString().substr(-2);
    return data && data.filter((el) => {
      var createDate = el.STARTDATE && el.STARTDATE.substring(0, 10);
      var monthLog = new Date(createDate).getMonth() + 1;
      var yearLog = new Date(createDate).getFullYear().toString().substr(-2);
      return monthLog == month && yearLog == yearRequest;
    });
  };

  const groupData = (data) => {
    var arr_group = [];
  
    data && data.forEach((value) => {
      const logDay = new Date(value.STARTDATE).getDate().toString();
  
      if (arr_group[value.key]) {
        if (arr_group[value.key].logs[logDay]) {
          arr_group[value.key].logs[logDay].timeworked += Number(value.timeworked);
        } else {
          arr_group[value.key].logs[logDay] = {
            comment: value.comment,
            timeworked: Number(value.timeworked),
            created: value.STARTDATE
          };
        }
      } else {
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
        };
      }
    });
  
    return arr_group;
  };

  const logTimeTotal = (arrLog = []) => {
    const t = arrLog.reduce(function (a, b) {
      return Number(a) + Number((b['timeworked'] / 3600).toFixed(2))
    }, 0)
    return (t)
  }

  const logTimeElement = (arrLog = [], ind) => {

    let timeworked
    let day_worked
    {
      arrLog.map((element) => {
  
        var createDate = element['created'].substring(0, 10)
        var createDate_arr = createDate.split('-')
        var get_day = createDate_arr[2]
        if (Number(ind) == get_day) {
          timeworked = Number((element['timeworked'] / 3600).toFixed(2))
          day_worked = get_day
        }
      })
    }
    if (timeworked) {
      return timeworked
    } else {
      return null
    }
  }

  const logTimeTotalIssue = (arrLog = []) => {
    const final = arrLog
      .map((item) =>
        Object.values(item['logs']).reduce((a, b) => Number(a) + Number((b['timeworked'] / 3600).toFixed(2)), 0)
      )
      .reduce((prev, curr) => prev + curr, 0);
  
    return final;
  };

  const logTimeTotalIssueByDay = (arrLog = [], numberDay) => {
    let final = 0;
    let t2 = 0;
  
    arrLog && arrLog.forEach((item) => {
      Object.values(item['logs']).forEach((item2) => {
        const createDate = item2['created'].substring(0, 10);
        const createDate_arr = createDate.split('-');
        const get_day = createDate_arr[2];
  
        if (Number(numberDay) === Number(get_day)) {
          const ts = Number((item2['timeworked'] / 3600).toFixed(2));
          t2 += ts;
        }
      });
      final = t2;
    });
    return final;
  };

  const getDatefromDay = (day, thismonth, thisyear) => {
    const fullday = `${thismonth}/${day}/${thisyear}`;
    const dt = new Date(fullday);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dt.getDay()].toUpperCase().slice(0, 2);
  };

  const year_url = year.toString().substr(-2);
  const issue_list = processData(dataTable, year_url, month);
  const arr_group = groupData(issue_list);
  const current = new Date().getDate();
  const thisyear = year;
  const days = new Date(thisyear, month, 0).getDate();
  const days_tbody = days + 4;

  const arr_days = Array.from({ length: days }, (_, index) => index + 1);
  const arr_days_tbody = Array.from({ length: days_tbody }, (_, index) => index + 1);

  const totalTimeIssue = arr_group ? logTimeTotalIssue(Object.values(arr_group)) : 0;

  return (
    <>
      <table className="log-work" id="content-bottom">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', width: 500, fontWeight: 700 }}>Issue</th>
            <th style={{ width: 75, fontWeight: 700 }}>Key</th>
            <th style={{ width: 75, fontWeight: 700 }}>Projects</th>
            <th style={{ width: 75, fontWeight: 700 }}>Log Time</th>
            {arr_days &&
              arr_days.map((item) => (
                <th
                  key={item}
                  className={`${item == current &&
                    new Date().getMonth() + 1 == month &&
                    new Date().getFullYear() == year
                    ? 'current date'
                    : 'date'
                    }`}
                  id={
                    ['SA', 'SU'].includes(getDatefromDay(item, month, thisyear)) ? 'weekend' : ''
                  }
                >
                  <strong>{item < 10 ? `0${item}` : item}</strong>
                  <br />
                  {getDatefromDay(item, month, thisyear)}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(arr_group).map((index) => (
            <tr key={index}>
              {arr_days_tbody &&
                arr_days_tbody.map((element, ind) => {
                  const { key, pkey, summary, logs } = arr_group[index];

                  switch (element) {
                    case 1:
                      return (
                        <td key={ind} className="title-issue">
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://jira.lotustest.net/browse/${key}`}
                            className="title"
                          >
                            {summary}
                          </a>
                        </td>
                      );
                    case 2:
                      return <td key={ind}>{key}</td>;
                    case 3:
                      return <td key={ind}>{pkey}</td>;
                    case 4:
                      return <td key={ind}>{logTimeTotal(Object.values(logs))}h</td>;
                    default:
                      return ['SA', 'SU'].includes(getDatefromDay(element - 4, month, thisyear)) ? (
                        <td key={ind} id="weekend"></td>
                      ) : (
                        <td key={ind}>
                          {logTimeElement(Object.values(logs), element - 4) !== null
                            ? `${logTimeElement(Object.values(logs), element - 4)}h`
                            : ''}
                        </td>
                      );
                  }
                })}
            </tr>
          ))}

          <tr className="last">
            <td colSpan={3}>Total</td>
            <td className="total">{totalTimeIssue}h</td>
            {arr_days.map((item) => {
              const countWorkDay = logTimeTotalIssueByDay(Object.values(arr_group), item);
              return countWorkDay === 0 ? (
                <td key={item}></td>
              ) : (
                <td key={item}>{countWorkDay} h</td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default LogWorkTablePage;
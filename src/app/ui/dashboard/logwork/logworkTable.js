"use client";

import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import LogWorkExcelPage from "@/app/ui/dashboard/logwork/logworkExcel";
import LogWorkDatePicker from "@/app/ui/dashboard/logwork/logworkDatePicker";
import {
  processData,
  groupData,
  logTimeTotal,
  logTimeElement,
  logTimeTotalIssue,
  logTimeTotalIssueByDay,
  getDatefromDay,
} from "@/app/lib/logWorkAction";

const LogWorkTablePage = (props) => {
  const { user, username, dataAllUser, dataIssue, month, year } = props;

  const [dataTable, setDataTable] = useState();

  useEffect(() => {
    setDataTable(dataIssue);
  }, [dataIssue]);

  const year_url = year.toString().substr(-2);
  const issue_list = processData(dataTable, year_url, month);
  const arr_group = groupData(issue_list);

  const current = new Date().getDate();
  const thisyear = year;
  const days = new Date(thisyear, month, 0).getDate();
  const days_tbody = days + 4;

  const arr_days = Array.from({ length: days }, (_, index) => index + 1);
  const arr_days_tbody = Array.from(
    { length: days_tbody },
    (_, index) => index + 1
  );

  const totalTimeIssue = arr_group
    ? logTimeTotalIssue(Object.values(arr_group))
    : 0;

  return (
    <>
      <div className="wrapper-datetime">
        <LogWorkDatePicker />
        <LogWorkExcelPage
          username={username}
          month={month}
          year={year}
          dataAllUser={dataAllUser}
          dataUserName={user.username}
        />
      </div>

      <table className="log-work" id="table-to-xls">
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                width: 500,
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              Issue
            </th>
            <th style={{ width: 75, fontWeight: 600, fontSize: "0.875rem" }}>
              Key
            </th>
            <th style={{ width: 75, fontWeight: 600, fontSize: "0.875rem" }}>
              Projects
            </th>
            <th style={{ width: 75, fontWeight: 600, fontSize: "0.875rem" }}>
              Log Time
            </th>
            {arr_days &&
              arr_days.map((item) => (
                <th
                  key={item}
                  className={`${
                    item == current &&
                    new Date().getMonth() + 1 == month &&
                    new Date().getFullYear() == year
                      ? "current date"
                      : "date"
                  }`}
                  id={
                    ["SA", "SU"].includes(getDatefromDay(item, month, thisyear))
                      ? "weekend"
                      : ""
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
                        <td
                          key={ind}
                          className={
                            pkey === "LRM"
                              ? "title-issue leave-date"
                              : "title-issue"
                          }
                        >
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://pm.lotustest.net/browse/${key}`}
                            className="title"
                          >
                            {summary}
                          </a>
                        </td>
                      );
                    case 2:
                      return (
                        <td
                          className={pkey === "LRM" ? "leave-date" : ""}
                          key={ind}
                        >
                          {key}
                        </td>
                      );
                    case 3:
                      return (
                        <td
                          className={pkey === "LRM" ? "leave-date" : ""}
                          key={ind}
                        >
                          {pkey}
                        </td>
                      );
                    case 4:
                      return (
                        <td
                          className={pkey === "LRM" ? "leave-date" : ""}
                          key={ind}
                        >
                          {pkey === "LRM"
                            ? ""
                            : `${logTimeTotal(Object.values(logs))}h`}
                        </td>
                      );
                    default:
                      return ["SA", "SU"].includes(
                        getDatefromDay(element - 4, month, thisyear)
                      ) ? (
                        <td
                          className={pkey === "LRM" ? "leave-date" : ""}
                          key={ind}
                          id="weekend"
                        >
                          {logTimeElement(Object.values(logs), element - 4) !==
                          null
                            ? `${logTimeElement(
                                Object.values(logs),
                                element - 4
                              )}h`
                            : ""}
                        </td>
                      ) : (
                        <td
                          className={pkey === "LRM" ? "leave-date" : ""}
                          key={ind}
                        >
                          {logTimeElement(Object.values(logs), element - 4) !==
                          null
                            ? `${logTimeElement(
                                Object.values(logs),
                                element - 4
                              )}h`
                            : ""}
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
              const countWorkDay = logTimeTotalIssueByDay(
                Object.values(arr_group),
                item
              );
              return countWorkDay === 0 ? (
                <td key={item}></td>
              ) : (
                <td key={item}>{countWorkDay}h</td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default LogWorkTablePage;

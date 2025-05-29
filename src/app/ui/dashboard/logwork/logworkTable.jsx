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
  logCommentElement,
  logTimeTotalIssue,
  logTimeTotalIssueByDay,
  getDatefromDay,
} from "@/app/lib/logWorkAction";
import styles from "./logwork.module.css";
import { auth } from "@/app/auth";
import { PiWarningBold } from "react-icons/pi";
import Loading from "@/app/ui/dashboard/loading/loading";
import { getAllDataUser, getUserIssues } from "@/app/lib/fetchApi";
import Unauthorized from "@/app/ui/dashboard/unauthorized/unauthorized";
import { filterWorklogsByAuthor } from "@/app/lib/logWorkAction";
import { useAuth } from "@/app/lib/AuthContext";

const LogWorkTablePage = ({searchParams}) => {

  const { currentUser } = useAuth();

  const [dataTable, setDataTable] = useState();
  
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState(null);
  
  const [error, setError] = useState(null);

  const year = searchParams?.year || new Date().getFullYear();
  
  const month = searchParams?.month || new Date().getMonth() + 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        let username = searchParams?.username || currentUser.name;

        const dataAllUser = await getAllDataUser();
        const dataUsers = await getUserIssues(username, year, month);

        if (dataUsers === "Unauthorized!" || dataAllUser === "fetch failed") {
          setError(dataUsers || "fetch failed");
          return;
        }

        const userLogwork = await filterWorklogsByAuthor(
          dataUsers.issues,
          username,
          month,
          year
        );

        setData({
          currentUser,
          username,
          dataAllUser,
          dataIssue: userLogwork,
          month,
          year,
        });
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);


  useEffect(() => {
    setDataTable(data?.dataIssue);
  }, [data?.dataIssue]);

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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Unauthorized status={error} />;
  }

  return (
    <>
      <div className="wrapper-datetime">
        <LogWorkDatePicker />
        <LogWorkExcelPage
          username={data?.username}
          month={month}
          year={year}
          dataAllUser={data?.dataAllUser}
          dataUserName={currentUser?.name}
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
                  className={`${item == current &&
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
                            null && (
                              <div className={`${styles.tooltip}`}>
                                {logTimeElement(Object.values(logs), element - 4)}
                                h
                                <div className={`${styles.tooltip_container}`}>
                                  <div className={`${styles.tooltip_text}`}>
                                    <p>
                                      {logCommentElement(
                                        Object.values(logs),
                                        element - 4
                                      ) ? (
                                        logCommentElement(
                                          Object.values(logs),
                                          element - 4
                                        )
                                      ) : (
                                        <>
                                          <PiWarningBold /> This logwork doesn't
                                          have a comment!
                                        </>
                                      )}
                                    </p>
                                  </div>
                                  <div
                                    className={`${styles.tooltip_text_bottom}`}
                                  ></div>
                                </div>
                              </div>
                            )}
                        </td>
                      ) : (
                        <td
                          className={pkey === "LRM" ? "leave-date" : ""}
                          key={ind}
                        >
                          {logTimeElement(Object.values(logs), element - 4) !==
                            null ? (
                            <div className={`${styles.tooltip}`}>
                              {logTimeElement(Object.values(logs), element - 4)}
                              h
                              <div className={`${styles.tooltip_container}`}>
                                <div className={`${styles.tooltip_text}`}>
                                  <p>
                                    {logCommentElement(
                                      Object.values(logs),
                                      element - 4
                                    ) ? (
                                      logCommentElement(
                                        Object.values(logs),
                                        element - 4
                                      )
                                    ) : (
                                      <>
                                        <PiWarningBold /> This logwork doesn't
                                        have a comment!
                                      </>
                                    )}
                                  </p>
                                </div>
                                <div
                                  className={`${styles.tooltip_text_bottom}`}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
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

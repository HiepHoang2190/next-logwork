"use client";

import { useAuth } from "@/app/lib/AuthContext";
import { getAllDataUser, getUserIssues } from "@/app/lib/fetchApi";
import {
  filterWorklogsByAuthor,
  getDatefromDay,
  groupData,
  logCommentElement,
  logTimeElement,
  logTimeTotal,
  logTimeTotalIssue,
  logTimeTotalIssueByDay,
  processData,
} from "@/app/lib/logWorkAction";
import Loading from "@/app/ui/dashboard/loading/loading";
import LogWorkDatePicker from "@/app/ui/dashboard/logwork/logworkDatePicker";
import LogWorkExcelPage from "@/app/ui/dashboard/logwork/logworkExcel";
import Unauthorized from "@/app/ui/dashboard/unauthorized/unauthorized";
import clsx from "clsx";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { PiWarningBold } from "react-icons/pi";
import styles from "./logwork.module.css";

const LogWorkTablePage = ({ searchParams }) => {

  const { currentUser } = useAuth();

  const [dataTable, setDataTable] = useState();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);

  const [error, setError] = useState(null);

  const year = searchParams?.year || new Date().getFullYear();

  const month = searchParams?.month || new Date().getMonth() + 1;

  //Get Username
  const username = searchParams?.username || currentUser?.name;

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      setLoading(true);
      try {

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
  }, [searchParams, username]);


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
          {Object.entries(arr_group).map(([index, group]) => {
            const { key, pkey, summary, logs } = group;
            const logValues = Object.values(logs);

            return (
              <tr key={index}>
                {arr_days_tbody.map((element, ind) => {
                  if (element === 1) {
                    return (
                      <td key={ind} className={clsx("title-issue", pkey === "LRM" && "leave-date")}>
                        <a
                          href={`https://pm.lotustest.net/browse/${key}`}
                          target="_blank"
                          rel="noreferrer"
                          className="title"
                        >
                          {summary}
                        </a>
                      </td>
                    );
                  }

                  if (element === 2) {
                    return <td key={ind} className={clsx(pkey === "LRM" && "leave-date")}>{key}</td>;
                  }

                  if (element === 3 || element === 4) {
                    return (
                      <td key={ind} className={clsx(pkey === "LRM" && "leave-date")}>
                        {element === 4 && pkey !== "LRM" ? `${logTimeTotal(logValues)}h` : pkey}
                      </td>
                    );
                  }

                  const day = element - 4;
                  const isWeekend = ["SA", "SU"].includes(getDatefromDay(day, month, thisyear));
                  const logTime = logTimeElement(logValues, day);
                  const comment = logCommentElement(logValues, day);

                  return (
                    <td
                      key={ind}
                      className={clsx(pkey === "LRM" && "leave-date")}
                      id={isWeekend ? "weekend" : ""}
                    >
                      {logTime && (
                        <div className={styles.tooltip}>
                          {logTime}h
                          <div className={styles.tooltip_container}>
                            <div className={styles.tooltip_text}>
                              <p>
                                {comment || (
                                  <>
                                    <PiWarningBold /> This logwork doesn't have a comment!
                                  </>
                                )}
                              </p>
                            </div>
                            <div className={styles.tooltip_text_bottom} />
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}

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

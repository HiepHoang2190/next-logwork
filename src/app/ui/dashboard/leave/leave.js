"use client";

import { useEffect, useState } from "react";
import { userAdmin } from "@/app/lib/variable";
import { updateQueryParam } from "@/app/lib/logWorkAction";
import styles from "@/app/ui/dashboard/leave/leave.module.css";
import UserSelection from "../logwork/logworkUserSelection";
import { useRouter, useSearchParams } from "next/navigation";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const LeavePage = (props) => {
  const { arr_time_leave, data_time_leave_total, dataUserName, dataAllUser } =
    props;

  const [userName, setUserName] = useState("");
  const [timeLeave, setTimeLeave] = useState([]);
  const [totalTimeLeave, setTotalTimeLeave] = useState();

  const isUserAdmin = userAdmin.includes(dataUserName);

  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleChange = async (event) => {
    setUserName(event.target.value);
    updateQueryParam("username", event.target.value, searchParams, replace);
  };

  const processLeaveItem = (item) => {
    const dd = item.create_date.split("-");
    const yearLeave = dd[0].substr(2);

    const date = new Date();
    const currentYear = date.getFullYear().toString().substr(2);

    if (yearLeave == currentYear) {
      return {
        time_estimate: item.time_estimate,
        time_spent: item.time_spent,
        time_remain: item.time_remain,
      };
    }
  };

  useEffect(() => {
    const currentYearData = data_time_leave_total.find((item) =>
      processLeaveItem(item)
    );
    setTimeLeave(arr_time_leave);
    setTotalTimeLeave(currentYearData);
  }, [data_time_leave_total, arr_time_leave]);

  return (
    <>
      {isUserAdmin && (
        <div className="wrapper-datetime">
          <UserSelection
            userName={userName}
            handleChange={handleChange}
            dataAllUser={dataAllUser}
          />
        </div>
      )}
      <div className={styles.container}>
        {totalTimeLeave && (
          <Box sx={{ width: "100%", display: "flex", margin: "0 0 20px" }}>
            <div className={styles.cardContainer}>
              <span className={styles.title_total}>Time Estimated (days):</span>{" "}
              {totalTimeLeave.time_estimate / 3600 / 8}
            </div>
            <div className={styles.cardContainerMiddle}>
              <span className={styles.title_total}>Time Spent (days):</span>{" "}
              {totalTimeLeave.time_spent / 3600 / 8}
            </div>
            <div className={styles.cardContainer}>
              <span className={styles.title_total}>Time Remaining (days):</span>{" "}
              {totalTimeLeave.time_remain / 3600 / 8}
            </div>
          </Box>
        )}

        <TableContainer className={styles.table_margin_top} component={Paper}>
          <Table aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={styles.issues}>Summary</TableCell>
                <TableCell className={styles.issues}>Comment</TableCell>
                <TableCell className={styles.issues}>Created Date</TableCell>
                <TableCell className={styles.issues}>Start Date</TableCell>
                <TableCell className={styles.issues}>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeLeave.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    row.difference_in_days < 2
                      ? styles.row_incorrect_time_limit
                      : ""
                  }
                >
                  <TableCell
                    className={styles.issueInfo}
                    component="th"
                    scope="row"
                  >
                    {row.summary}
                  </TableCell>
                  <TableCell
                    className={styles.issueInfo}
                    component="th"
                    scope="row"
                  >
                    {row.desc}
                  </TableCell>
                  <TableCell
                    className={styles.issueInfo}
                    component="th"
                    scope="row"
                  >
                    {row.create_date}
                  </TableCell>
                  <TableCell
                    className={styles.issueInfo}
                    component="th"
                    scope="row"
                  >
                    {row.start_date}
                  </TableCell>
                  <TableCell
                    className={styles.issueInfo}
                    component="th"
                    scope="row"
                  >
                    {row.due_date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default LeavePage;

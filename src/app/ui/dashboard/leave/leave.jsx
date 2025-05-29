"use client";

import { useAuth } from "@/app/lib/AuthContext";
import { fetchDataLeave, getAllDataUser } from "@/app/lib/fetchApi";
import { updateQueryParam } from "@/app/lib/logWorkAction";
import { userAdmin } from "@/app/lib/variable";
import styles from "@/app/ui/dashboard/leave/leave.module.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/app/ui/dashboard/loading/loading";
import UserSelection from "@/app/ui/dashboard/logwork/logworkUserSelection";
import Unauthorized from "@/app/ui/dashboard/unauthorized/unauthorized";

const LeavePage = ({ searchParams }) => {

  const { currentUser } = useAuth();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState("");

  const [error, setError] = useState(null);

  const isUserAdmin = userAdmin.includes(currentUser?.name);

  const { replace } = useRouter();

  const handleChange = async (event) => {
    setUserName(event.target.value);
    updateQueryParam("username", event.target.value, searchParams, replace);
  };

  const processLeaveItem = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }
    return items.reduce((newest, current) => {
      return new Date(current.create_date) > new Date(newest.create_date) ? current : newest;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        //Fetch Data
        const dataAllUsers = await getAllDataUser();

        var username = searchParams?.username;
        username = username !== undefined ? username : currentUser?.name;

        const currentUserData = dataAllUsers.find(
          (data) => data.user_name === username
        );

        const { arr_time_leave, arr_time_leave_total } = await fetchDataLeave(
          currentUserData?.user_key
        );

        const currentYearData = processLeaveItem(arr_time_leave_total);
        
        setData({
          currentUser,
          username,
          dataAllUser: dataAllUsers,
          timeLeave: arr_time_leave,
          totalTimeLeave: currentYearData
        });

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchParams]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Unauthorized status={error} />;
  }

  return (
    <>
      {isUserAdmin && (
        <div className="wrapper-datetime">
          <UserSelection
            userName={userName}
            handleChange={handleChange}
            dataAllUser={data?.dataAllUser}
          />
        </div>
      )}
      <div className={styles.container}>
        {data?.totalTimeLeave && (
          <Box sx={{ width: "100%", display: "flex", margin: "0 0 20px" }}>
            <div className={styles.cardContainer}>
              <span className={styles.title_total}>Time Estimated (days):</span>{" "}
              {parseFloat((data?.totalTimeLeave.time_estimate / 3600 / 8).toFixed(2))}
            </div>
            <div className={styles.cardContainerMiddle}>
              <span className={styles.title_total}>Time Spent (days):</span>{" "}
              {parseFloat((data?.totalTimeLeave.time_spent / 3600 / 8).toFixed(2))}
            </div>
            <div className={styles.cardContainer}>
              <span className={styles.title_total}>Time Remaining (days):</span>{" "}
              {parseFloat((data?.totalTimeLeave.time_remain / 3600 / 8).toFixed(2))}
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
              {data?.timeLeave.map((row) => (
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

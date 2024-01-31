"use client";

import styles from "./card.module.css";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import { formatDate } from "@/app/lib/logWorkAction";

const OpenTickets = (props) => {
  const { dataIssue } = props;

  const formatDateString = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);

      // Format the date string using the options
      const formattedDateString = formatDate(date);
      return formattedDateString;
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.texts}>
        <TableContainer className={styles.table_margin_top} component={Paper}>
          <Table aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={styles.issues} style={{ width: "8%" }}>
                  Issues No
                </TableCell>
                <TableCell className={styles.issues} style={{ width: "25%" }}>
                  Summary
                </TableCell>
                <TableCell className={styles.issues} style={{ width: "10%" }}>
                  Type
                </TableCell>
                <TableCell className={styles.issues} style={{ width: "10%" }}>
                  Reporter
                </TableCell>
                <TableCell className={styles.issues} style={{ width: "10%" }}>
                  Priority
                </TableCell>
                <TableCell className={styles.issues} style={{ width: "13%" }}>
                  Status
                </TableCell>
                <TableCell className={styles.issues} style={{ width: "15%" }}>
                  Created
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataIssue.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className={styles.issueInfo}>{row.key}</TableCell>
                  <TableCell className={styles.issueInfo}>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://pm.lotustest.net/browse/${row.key}`}
                      className={styles.title}
                    >
                      {row.summary}
                    </a>
                  </TableCell>
                  <TableCell className={styles.issueInfo}>
                    <img
                      className={styles.issueType}
                      src={row.issuetypeicon}
                      alt=""
                      width="20"
                      height="20"
                    />
                    {row.issuetype}
                  </TableCell>
                  <TableCell className={styles.issueInfo}>
                    {row.reporter}
                  </TableCell>
                  <TableCell className={styles.issueInfo}>
                    <img
                      className={styles.issueType}
                      src={row.priorityicon}
                      alt=""
                      width="20"
                      height="20"
                    />
                    {row.prioritytype}
                  </TableCell>
                  <TableCell className={styles.issueInfo}>
                    {" "}
                    {row.issuestatus}
                  </TableCell>
                  <TableCell className={styles.issueInfo}>
                    {formatDateString(row.created)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default OpenTickets;

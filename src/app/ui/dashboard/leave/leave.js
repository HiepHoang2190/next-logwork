'use client'

import { userAdmin } from "@/app/lib/variable"
import { updateQueryParam } from "@/app/lib/logWorkAction"
import styles from '@/app/ui/dashboard/leave/leave.module.css'
import { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import UserSelection from '../logwork/logworkUserSelection'
import { useRouter, useSearchParams } from 'next/navigation'

const LeavePage = (props) => {

  const { arr_time_leave, data_time_leave_total, dataUserName, dataAllUser } = props

  const [userName, setUserName] = useState('');
  const [timeLeave, setTimeLeave] = useState([])
  const [totalTimeLeave, setTotalTimeLeave] = useState([])

  const isUserAdmin = userAdmin.includes(dataUserName);

  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleChange = async (event) => {
    setUserName(event.target.value);
    updateQueryParam('username', event.target.value, searchParams, replace);
  };

  const processLeaveItem = (item) => {
    const dd = item.create_date.split('-')
    const yearLeave = dd[0].substr(2)

    const date = new Date()
    const currentYear = date.getFullYear().toString().substr(2)

    if (yearLeave == currentYear) {
      return {
        'time_estimate': (item.time_estimate),
        'time_spent': (item.time_spent),
        'time_remain': (item.time_remain),
      }
    }
  }

  useEffect(() => {
    const currentYearData = data_time_leave_total.filter((item) => (processLeaveItem(item)))
    setTimeLeave(arr_time_leave)
    setTotalTimeLeave(currentYearData)

  }, [data_time_leave_total, arr_time_leave])

  return (
    <>
      {isUserAdmin &&
        <div className='wrapper-datetime'>
          <UserSelection userName={userName} handleChange={handleChange} dataAllUser={dataAllUser} />
        </div>
      }

      <div className="mt-3">
        <TableContainer className={styles.table_margin_top} component={Paper} style={{ borderRadius: '5px' }}>
          <Table aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={styles.issues}>Summary</TableCell>
                <TableCell className={styles.issues} align="right">Comment</TableCell>
                <TableCell className={styles.issues} align="right">Created Date</TableCell>
                <TableCell className={styles.issues} align="right">Start Date</TableCell>
                <TableCell className={styles.issues} align="right">Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeLeave.map((row) => (
                <TableRow key={row.id} className={row.difference_in_days < 2 ? styles.row_incorrect_time_limit : ''}>
                  <TableCell component="th" scope="row">
                    {row.summary}
                  </TableCell>
                  <TableCell align="right">{row.desc}</TableCell>
                  <TableCell align="right">{row.create_date}</TableCell>
                  <TableCell align="right">{row.start_date}</TableCell>
                  <TableCell align="right">{row.due_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ width: '100%', maxWidth: 500, marginTop: 2 }}>
          {totalTimeLeave && totalTimeLeave.map((item, key) => (
            <div key={key}>
              <Typography variant="subtitle1" gutterBottom>
                <span className={styles.title_total}>Time Estimated:</span> {(((item.time_estimate) / 3600 / 8)) + ' days'}
              </Typography><Typography variant="subtitle1" gutterBottom>
                <span className={styles.title_total}>Time Spent:</span> {((item.time_spent / 3600 / 8)) + ' days'}
              </Typography><Typography variant="subtitle1" gutterBottom>
                <span className={styles.title_total}>Time Remaining:</span> {((item.time_remain / 3600 / 8)) + ' days'}
              </Typography>
            </div>
          ))}
        </Box>
      </div>
    </>
  )
}

export default LeavePage
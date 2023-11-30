'use client'

import styles from '@/app/ui/dashboard/leave/leave.module.css'
import { dataleave, dataleavetotal } from '@/app/lib/datasource'
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


const LeavePage = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const newData = [...data]
    dataleave.map((item) => {

      const dd = item.create_date.split('-')

      const monthLeave = dd[1]
      const yearLeave = dd[0].substr(2)
      const createDate = item.create_date.split(' ')
      const startDate = item.start_date.split(' ')
      const dueDate = item.due_date.split(' ')

      const date1 = new Date(item.create_date)
      const date2 = new Date(item.start_date)
      const date3 = new Date(item.due_date)

      const difference_in_time = date2.getTime() - date1.getTime()
      const difference_in_days = difference_in_time / (1000 * 3600 * 24)

      function formatDate(date) {
        return [
          padTo2Digits(date.getDate()),
          padTo2Digits(date.getMonth() + 1),
          date.getFullYear()
        ].join('-')
      }

      function padTo2Digits(num) {
        return num.toString().padStart(2, '0')
      }

      const createDateFormat = formatDate(date1)
      const startDateFormat = formatDate(date2)
      const dueDateFormat = formatDate(date3)

      const date = new Date()
      const currentYear = date.getFullYear().toString().substr(2)
      if (yearLeave == currentYear) {
        newData.push({
          'creator': item.creator,
          'summary': item.summary,
          'desc': item.desc,
          'create_date': createDateFormat,
          'due_date': dueDateFormat,
          'id':  item.id,
          'start_date': startDateFormat,
          'year_leave':yearLeave,
          'current_year': currentYear,
          'difference_in_days':difference_in_days
        })
      }
    })
    setData(newData)
  }, [])
  console.log('data', data)
  return (
    <div className="mt-3">
      <TableContainer className={styles.table_margin_top} component={Paper} style={{ borderRadius: '10px' }}>
        <Table aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Summary</TableCell>
              <TableCell align="right">Comment</TableCell>
              <TableCell align="right">Create Date</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} className={row.difference_in_days<2 ? styles.row_incorrect_time_limit : ''}>
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
      <Box sx={{ width: '100%', maxWidth: 500, marginTop:2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <span className={styles.title_total}>Time Estimated:</span> {((dataleavetotal[0].time_estimate/3600/8)) +' days'}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <span className={styles.title_total}>Time Spent:</span> {((dataleavetotal[0].time_spent/3600/8)) +' days'}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <span className={styles.title_total}>Time Remaining:</span> {((dataleavetotal[0].time_remain/3600/8)) +' days'}
        </Typography>

      </Box>
    </div>
  )
}

export default LeavePage
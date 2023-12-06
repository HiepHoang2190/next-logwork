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

const LeavePage = (props) => {

  const { arr_time_leave, data_time_leave_total } = props

  const [data, setData] = useState([])
  const [product, setProduct] = useState([])

  useEffect(() => {
    setData(arr_time_leave)
    setProduct(data_time_leave_total)


  }, [data, product])

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
        {
          product.map((item) => (
            <><Typography variant="subtitle1" gutterBottom>
              <span className={styles.title_total}>Time Estimated:</span> {((item.time_estimate / 3600 / 8)) + ' days'}
            </Typography><Typography variant="subtitle1" gutterBottom>
              <span className={styles.title_total}>Time Spent:</span> {((item.time_spent / 3600 / 8)) + ' days'}
            </Typography><Typography variant="subtitle1" gutterBottom>
              <span className={styles.title_total}>Time Remaining:</span> {((item.time_remain / 3600 / 8)) + ' days'}
            </Typography></>
          ))
        }
      </Box>
    </div>
  )
}

export default LeavePage
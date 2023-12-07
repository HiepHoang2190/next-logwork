'use client'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const UiPage3 = () => {
  const [startDate, setStartDate] = useState(new Date())

  console.log('startDate', startDate)
  return (
    <>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="MM/yyyy"
        showMonthYearPicker
      />
    </>

  )
}

export default UiPage3
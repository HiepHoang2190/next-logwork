'use client'
import DatePicker from 'react-datepicker'
import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const LogWorkDatePicker = () => {
  
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const [mounted, setMounted] = useState(false)
  const [startDate, setStartDate] = useState(new Date())


  useEffect(() => {
    setMounted(true)
 
   // Check if 'month' and 'year' exist in searchParams
   if (searchParams.has('month') && searchParams.has('year')) {
    const month = parseInt(searchParams.get('month'), 10)
    const year = parseInt(searchParams.get('year'), 10)

    if (!isNaN(month) && !isNaN(year)) {
      setStartDate(new Date(year, month - 1, 1)) // Adjust month value since it's zero-based
    }
  }
}, [searchParams])

  const handleDateChange = (date) => {
    const params = new URLSearchParams(searchParams)
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    if (month) {
      params.set('month', month)
      params.set('year', year)
    } else {
      params.delete('month')
      params.delete('year')
    }

    replace(`${pathname}?${params}`)
    setStartDate(date)
  }

  return (
    <>
      {mounted && (
        <div className='box-datetime'>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            value={startDate}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        </div>
      )}
    </>
  )
}

export default LogWorkDatePicker

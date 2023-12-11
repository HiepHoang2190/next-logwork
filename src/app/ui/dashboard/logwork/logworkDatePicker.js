'use client'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'


const LogWorkDatePicker = () => {

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [startDate, setStartDate] = useState(new Date())
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()

  return (
    <>
      {mounted ? (
        <div className='box-datetime'>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              const params = new URLSearchParams(searchParams)
              var month = date.getMonth() + 1
              var year = date.getFullYear()
              if (month) {
                params.set('month', month)
                params.set('year', year)
              } else {
                params.delete('month')
                params.delete('year')
              }
              replace(`${pathname}?${params}`)

              setStartDate(date)

            }}
            value={startDate}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        </div>) : ("")}
    </>
  )
}

export default LogWorkDatePicker
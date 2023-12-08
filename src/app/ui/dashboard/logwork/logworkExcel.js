'use client'
import { useEffect, useState } from 'react'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'


const LogWorkExcelPage = (props) => {

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { username, month, year} = props

  return (
    <div className='box-excel-export'>
      <ReactHTMLTableToExcel
        id="table-export-xls-button"
        className="download-table-xls-button"
        table="table-to-xls"
        filename= {username+'-'+year+'-'+month}
        sheet="tablexls"
        buttonText="Download as XLS"/>
    </div>
  )
}

export default LogWorkExcelPage
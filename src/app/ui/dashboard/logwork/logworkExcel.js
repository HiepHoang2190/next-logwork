'use client'
import { userAdmin } from "@/app/lib/variable"
import { updateQueryParam } from "@/app/lib/logWorkAction"
import { useEffect, useState } from 'react'
import UserSelection from './logworkUserSelection'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'


const LogWorkExcelPage = (props) => {
  const { username, month, year, dataUserName, dataAllUser } = props

  const isUserAdmin = userAdmin.includes(dataUserName);
  const [userName, setUserName] = useState('');

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const paramsUserName = searchParams.get('username');
    // If searchParams has a username value, set userName accordingly
    if (paramsUserName) {
      setUserName(paramsUserName);
    }
  }, [searchParams])

  const handleChange = async (event) => {
    setUserName(event.target.value);
    updateQueryParam('username', event.target.value, searchParams, replace);
  };


  return (
    <>
      <div className='box-excel-export'>
        <ReactHTMLTableToExcel
          id="table-export-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename={username + '-' + year + '-' + month}
          sheet="tablexls"
          buttonText="Download as XLS"
        />
      </div>
      {isUserAdmin && 
        <UserSelection userName={userName} handleChange={handleChange} dataAllUser={dataAllUser} />
      }
    </>
  )
}

export default LogWorkExcelPage
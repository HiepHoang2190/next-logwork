'use client'
import { useEffect, useState } from 'react'
import UserSelection from './logworkUserSelection'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'


const LogWorkExcelPage = (props) => {
  const { username, month, year, dataUserName, dataAllUser } = props
  
  const userAdmin = ['phuong', 'minh', 'admin', 'hieph', 'minht'];
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
    const params = new URLSearchParams(searchParams);

    if (event.target.value) {
      params.set('username', event.target.value);
    } else {
      params.delete('username');
    }
    replace(`${pathname}?${params}`);

    try {
      const dataIssue = await getUserIssue(event.target.value)
        .then(response => response.json())
        .then(data => {
          const newLWork = data.message.map((item) => ({
            'issueid': item.issueid,
            'SUMMARY': item.SUMMARY,
            'timeworked': `Project Key: ${item.key}\n\n Log Time: ${item.timeworked / 3600}h`,
            'CREATED': item.CREATED,
            'UPDATED': item.UPDATED,
            'STARTDATE': item.STARTDATE
          }));
          setLogWork(newLWork);
        });
    } catch (error) {
      console.error('Error:', error);
    }
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
      {isUserAdmin && <UserSelection userName={userName} handleChange={handleChange} dataAllUser={dataAllUser} />}
    </>
  )
}

export default LogWorkExcelPage
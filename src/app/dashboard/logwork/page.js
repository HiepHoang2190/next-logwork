'use client'
import styles from '@/app/ui/dashboard/logwork/logwork.module.css'
import { ScheduleComponent, Year, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule'

import '../../../../node_modules/@syncfusion/ej2-base/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-calendars/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-lists/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-popups/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css'

import { datasource, dataAllUser } from '@/app/lib/datasource'
import getLogWork from '@/app/lib/getLogWork'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import axios from 'axios'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const LogWorksPage = () => {
//   const [ toDos, setToDos ] = useState()
// const [isLoading, setIsLoading] = useState(false)
// useEffect(() => {
//   setIsLoading(true)
//   fetch('http://api-jira.lotustest.net/rest/V1/user/thao',
//   {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json, text/plain, */*',
//                       'Content-Type': 'application/json',
//                       'Access-Control-Allow-Origin': 'http://192.168.11.153:3001',
//     									'Access-Control-Allow-Methods':'*',
//     									'Access-Control-Allow-Credentials':'true',
//     									'Access-Control-Allow-Headers':'X-CSRF-Token'
//       }})
//       .then(response => response.json())
//       .then(data => {
//         console.log(data)
//           setToDos(data) // Set the toDo variable
//           setIsLoading(false)
//       })
// }, [])
// if (isLoading) {
//   return <p>Loading....</p>
// }
// if (!toDos) {
//   return <p>No List to show</p>
// }
  // const logwork = use(getLogWork())


  // useEffect(() => {
  //   const handle = async () => {
  //     const logwork = await getLogWork()

  //     console.log(logwork)
  //   }
  //   handle

  // }, [])
  // const fetcher = (url) => fetch(url, {
  //   method: 'GET',
  //   headers: {
  //     'Accept': 'application/json, text/plain, */*',
  //                   'Content-Type': 'application/json',
  //                   'Access-Control-Allow-Origin': 'http://192.168.11.153:3001',
  // 									'Access-Control-Allow-Methods':'*',
  // 									'Access-Control-Allow-Credentials':'true',
  // 									'Access-Control-Allow-Headers':'X-CSRF-Token'
  //   }
  // })
  //   .then((res) => res.json())

  // const { data, error, isLoading } = useSWR(
  //   'http://api-jira.lotustest.net/rest/V1/user/thao',
  //   fetcher,
  //   {
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false
  //   }
  // )
  // console.log(data)
  // if (isLoading) {
  //   return <div>loading...</div>
  // }


  // const [datawork, setDataWork] = useState([])
  // {logwork.map(item => {

  //   setDataWork(current => [...current, item]);
  // })}
  //   useEffect(() => {
  //     {logwork.map(item => {

  //       setDataWork(current => [...current, item]);
  //     })}
  //     setDataWork(datasource);
  // },[]);
  // datasource = logwork;
  const [logWork, setLogWork] = useState([{
    'issueid':'',
    'SUMMARY':'',
    'timeworked':'',
    'CREATED':'',
    'UPDATED':''
  }])
  const [paramUserName, setParamUserName] = useState('')
  // const username = useSearchParams().get('username')

  useEffect(() => {


    const newLogWork = [...logWork]
    if (paramUserName =='hieph') {
      console.log('paramUserName', paramUserName)

      console.log('logWork', logWork)

      datasource.map((item) => {

        newLogWork.push({
          'issueid':item.issueid,
          'SUMMARY':item.SUMMARY,
          'timeworked':'Project: '+item.pkey+'\n\n Key: '+item.key+'\n\n Log Time: '+(item.timeworked)/3600+'h',
          'CREATED':item.CREATED,
          'UPDATED':item.UPDATED
        })

      })
      console.log('newLogWork', newLogWork)

      setLogWork(newLogWork)
      console.log('logWork', logWork)
    } else {
      setLogWork([{}])
    }
  }, [paramUserName])


  useEffect(() => {
    const newLogWork = [...logWork]
    datasource.map((item) => {
      newLogWork.push({
        'issueid':item.issueid,
        'SUMMARY':item.SUMMARY,
        'timeworked':'Project: '+item.pkey+'\n\n Key: '+item.key+'\n\n Log Time: '+(item.timeworked)/3600+'h',
        'CREATED':item.CREATED,
        'UPDATED':item.UPDATED
      })
    })
    setLogWork(newLogWork)
  }, [])

  // console.log(logWork)
  // useEffect(() => {
  //   axios
  //     .get("http://api-jira.lotustest.net/rest/V1/user/hieph")
  //     .then((res) => {
  //       setData(res.data);
  //       console.log("Result:", data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);


  const [userName, setUserName] = useState('')

  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()

  const handleChange = (event) => {

    setUserName(event.target.value)
    const params = new URLSearchParams(searchParams)

    if (event.target.value) {
      params.set('username', event.target.value)
      setParamUserName(event.target.value)
    } else {
      params.delete('username')
    }
    replace(`${pathname}?${params}`)

  }

  const fieldsData = {
    id: 'issueid',
    subject: { name: 'SUMMARY' },
    description: { name: 'timeworked' },
    startTime: { name: 'CREATED' },
    endTime: { name: 'UPDATED' }
  }
  const eventSettings = { dataSource: logWork, fields: fieldsData }
  return (
    <div className="mt-3">

      {/* <ul>
      {logwork?.map(item => {
        return(
          <li key={item.isueid}>
              {item.SUMMARY}
          </li>
        )
      })}
    </ul> */}
      <Box sx={{ marginTop: 4 }}>
        <FormControl>
          <InputLabel style={{ color: '#FFFFFF' }} id="demo-simple-select-label">Name</InputLabel>
          <Select
            variant="outlined"
            sx={{
              width: 200,
              marginRight: 15,
              color: '#fff',
              '& .MuiSvgIcon-root': {
                color: 'white'
              }
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={userName}
            label="Name"
            onChange={handleChange}

          >
            {dataAllUser.map((item) => (
              <MenuItem key={item.user_name} value={item.user_name}>{item.display_name}</MenuItem>
            ))
            }
          </Select>
        </FormControl>
      </Box>
      <ScheduleComponent height='750px' currentView='Month' eventSettings={eventSettings}>
        <ViewsDirective>
          <ViewDirective option='Week' readonly={true}/>
          <ViewDirective option='Month' readonly={true} />
          <ViewDirective option='Day' readonly={true} />

          <ViewDirective option='Year' readonly={true} />

        </ViewsDirective>
        <Inject services={[Year, Week, Month, Day]} />
      </ScheduleComponent>


    </div>
  )
}

export default LogWorksPage
'use client'
import styles from '@/app/ui/dashboard/logwork/logwork.module.css'
import { ScheduleComponent, Year, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule'

import '../../../node_modules/@syncfusion/ej2-base/styles/material.css'
import '../../../node_modules/@syncfusion/ej2-buttons/styles/material.css'
import '../../../node_modules/@syncfusion/ej2-calendars/styles/material.css'
import '../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css'
import '../../../node_modules/@syncfusion/ej2-inputs/styles/material.css'
import '../../../node_modules/@syncfusion/ej2-lists/styles/material.css'
import '../../../node_modules/@syncfusion/ej2-navigations/styles/material.css'
import '../../../node_modules/@syncfusion/ej2-popups/styles/material.css'
import '../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css'
import '../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css'

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
import $ from 'jquery'

const LogWorksPage2 = (props) => {
  const { dataIssue, dataUserName } = props


  const [logWork, setLogWork] = useState([{
    'issueid':'',
    'SUMMARY':'',
    'timeworked':'',
    'CREATED':'',
    'UPDATED':'',
    'STARTDATE':''
  }])
  const [paramUserName, setParamUserName] = useState('')

  useEffect(() => {
    console.log('texttt',($('.e-tbar-btn-text').html()))
    const newLogWork = [...logWork]
    dataIssue.map((item) => {
      newLogWork.push({
        'issueid':item.issueid,
        'SUMMARY':item.SUMMARY,
        'timeworked':'Project: '+item.pkey+'\n\n Key: '+item.key+'\n\n Log Time: '+(item.timeworked)/3600+'h',
        'CREATED':item.CREATED,
        'UPDATED':item.UPDATED,
        'STARTDATE':item.STARTDATE
      })
    })
    setLogWork(newLogWork)
  }, [])


  const [userName, setUserName] = useState('')

  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()

  const handleChange = async (event) => {

    setUserName(event.target.value)
    const params = new URLSearchParams(searchParams)

    if (event.target.value) {
      params.set('username', event.target.value)
      setParamUserName(event.target.value)
    } else {
      params.delete('username')
    }
    replace(`${pathname}?${params}`)

    try {
      const dataIssue = await fetch('http://localhost:3000/api/getIssueList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: event.target.value })
      })
        .then(response => response.json())
        .then(data => {
          const newLWork = []
          data.message.map((item) => {
            newLWork.push({
              'issueid':item.issueid,
              'SUMMARY':item.SUMMARY,
              'timeworked':'Project: '+item.pkey+'\n\n Key: '+item.key+'\n\n Log Time: '+(item.timeworked)/3600+'h',
              'CREATED':item.CREATED,
              'UPDATED':item.UPDATED,
              'STARTDATE':item.STARTDATE
            })
          })
          setLogWork(newLWork)

        })

    } catch (error) {
      console.error('Error:', error)
    }
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

export default LogWorksPage2
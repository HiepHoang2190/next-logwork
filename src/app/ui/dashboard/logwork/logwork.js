'use client'
import styles from '@/app/ui/dashboard/logwork/logwork.module.css'
import { getCurrentViewDates, ScheduleComponent, Year, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule'


import '../../../../../node_modules/@syncfusion/ej2-base/styles/material.css'
import '../../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css'
import '../../../../../node_modules/@syncfusion/ej2-calendars/styles/material.css'
import '../../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css'
import '../../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css'
import '../../../../../node_modules/@syncfusion/ej2-lists/styles/material.css'
import '../../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css'
import '../../../../../node_modules/@syncfusion/ej2-popups/styles/material.css'
import '../../../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css'
import '../../../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css'

import { useEffect, useState } from 'react'


import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const LogWorksUi = (props) => {
  const { dataIssue, dataUserName, dataAllUser } = props

  const userAdmin = ['phuong', 'minh', 'admin', 'hieph', 'minht']
  const isUserAdmin = userAdmin.includes(dataUserName)


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

  const selectFieldStyles = {
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: '#E34824'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E34824',
      borderWidth: 'thin'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E34824',
      borderWidth: 'thin'
    }
  }
  return (
    <div className="mt-3">
      {isUserAdmin ? (
        <Box sx={{ marginBottom: 4, marginTop: 4, display:'flex', justifyContent:'end' }}>
          <FormControl>
            <InputLabel style={{ color: '#FFFFFF' }} id="demo-simple-select-label">Name</InputLabel>
            <Select
              variant="outlined"
              sx={{
                width: 200,
                marginRight: 0,
                color: '#fff',
                '& .MuiSvgIcon-root': {
                  color: 'white'
                },
                'MuiOutlinedInput': {
                  borderColor: 'white'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#115191',
                  borderWidth: '0.15rem'
                },
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                  borderWidth: '0.15rem'
                },
                // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                //   borderColor: '#E34824',
                //   borderWidth: 'thin'
                // }
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
      ) : (
        <></>
      )}

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

export default LogWorksUi
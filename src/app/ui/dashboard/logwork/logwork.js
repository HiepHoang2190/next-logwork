'use client'
import styles from '@/app/ui/dashboard/logwork/logwork.module.css'
import { useEffect, useState } from 'react'
import {
  getCurrentViewDates,
  ScheduleComponent,
  Year,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  ViewsDirective,
  ViewDirective
} from '@syncfusion/ej2-react-schedule'

import '@syncfusion/ej2-base/styles/material.css'
import '@syncfusion/ej2-buttons/styles/material.css'
import '@syncfusion/ej2-calendars/styles/material.css'
import '@syncfusion/ej2-dropdowns/styles/material.css'
import '@syncfusion/ej2-inputs/styles/material.css'
import '@syncfusion/ej2-lists/styles/material.css'
import '@syncfusion/ej2-navigations/styles/material.css'
import '@syncfusion/ej2-popups/styles/material.css'
import '@syncfusion/ej2-splitbuttons/styles/material.css'
import '@syncfusion/ej2-react-schedule/styles/material.css'

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getUserIssue } from '@/app/lib/fetchApi'

// Component for user selection
const UserSelection = ({ userName, handleChange, dataAllUser }) => {
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
  };
  return (
    <Box sx={{ marginBottom: 4, marginTop: 4, display: 'flex', justifyContent: 'end' }}>
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
            ...selectFieldStyles
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={userName}
          label="Name"
          onChange={handleChange}
        >
          {dataAllUser.map((item) => (
            <MenuItem key={item.user_name} value={item.user_name}>{item.display_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
};

// Component for schedule
const Schedule = ({ logWork }) => {
  const fieldsData = {
    id: 'issueid',
    subject: { name: 'SUMMARY' },
    description: { name: 'timeworked' },
    startTime: { name: 'CREATED' },
    endTime: { name: 'UPDATED' }
  };
  const eventSettings = { dataSource: logWork, fields: fieldsData };

  return (
    <ScheduleComponent height='750px' currentView='Month' eventSettings={eventSettings}>
      <ViewsDirective>
        <ViewDirective option='Week' readonly={true} />
        <ViewDirective option='Month' readonly={true} />
        <ViewDirective option='Day' readonly={true} />
        <ViewDirective option='Year' readonly={true} />
      </ViewsDirective>
      <Inject services={[Year, Week, Month, Day]} />
    </ScheduleComponent>
  );
};

// Main component
const LogWorksUi = (props) => {
  const { dataIssue, dataUserName, dataAllUser } = props;
  const userAdmin = ['phuong', 'minh', 'admin', 'hieph', 'minht'];
  const isUserAdmin = userAdmin.includes(dataUserName);

  const [logWork, setLogWork] = useState([]);

  const [userName, setUserName] = useState('');
  const [paramUserName, setParamUserName] = useState('');

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  
  
  // Remove the div that contains the Syncfusion license message
  const removeLicenseMessage = () => {
    const divs = document.querySelectorAll('div span'); 
    divs.forEach((span) => {
      if (
        span.textContent.includes("This application was built using a trial version of Syncfusion Essential Studio. To remove the license validation message permanently, a valid license key must be included.")
      ) {
        const parentDiv = span.closest('div');
        if (parentDiv) {
          parentDiv.parentNode.removeChild(parentDiv);
        }
      }
    });

    const modal = document.querySelectorAll('div');
    modal.forEach((item) => {
      if (item.textContent.includes("Claim your FREE account and get a key in less than a minute")) {
        const parentDiv = item.closest('div');
        if (parentDiv) {
          parentDiv.parentNode.removeChild(parentDiv);
        }
      }
    });
  }

  useEffect(() => {

    const newLogWork = dataIssue.map((item) => ({
      'issueid': item.issueid,
      'SUMMARY': item.SUMMARY,
      'timeworked': `Project: ${item.pkey}\n\n Key: ${item.key}\n\n Log Time: ${item.timeworked / 3600}h`,
      'CREATED': item.CREATED,
      'UPDATED': item.UPDATED,
      'STARTDATE': item.STARTDATE
    }));

    setLogWork(newLogWork);
    const paramsUserName = searchParams.get('username');

    // If searchParams has a username value, set userName accordingly
    if (paramsUserName) {
      setUserName(paramsUserName);
    }
    
    // Remove the div that contains the Syncfusion license message
    removeLicenseMessage();

  }, [dataIssue, searchParams]);


  const handleChange = async (event) => {

    setUserName(event.target.value);
    const params = new URLSearchParams(searchParams);

    if (event.target.value) {
      params.set('username', event.target.value);
      setParamUserName(event.target.value);
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
            'timeworked': `Project: ${item.pkey}\n\n Key: ${item.key}\n\n Log Time: ${item.timeworked / 3600}h`,
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
    <div className="mt-3">
      {isUserAdmin && <UserSelection userName={userName} handleChange={handleChange} dataAllUser={dataAllUser} />}

      <Schedule logWork={logWork} />
    </div>
  );
};

export default LogWorksUi;

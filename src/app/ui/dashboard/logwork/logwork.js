'use client'
import { useEffect, useState } from 'react'
import { getUserIssue } from '@/app/lib/fetchApi'
import UserSelection from './logworkUserSelection'
import {
  Day,
  Week,
  Month,
  Year,
  Inject,
  ViewDirective,
  ViewsDirective,
  ScheduleComponent,
} from '@syncfusion/ej2-react-schedule'

import '@syncfusion/ej2-base/styles/material.css'
import '@syncfusion/ej2-lists/styles/material.css'
import '@syncfusion/ej2-popups/styles/material.css'
import '@syncfusion/ej2-inputs/styles/material.css'
import '@syncfusion/ej2-buttons/styles/material.css'
import '@syncfusion/ej2-calendars/styles/material.css'
import '@syncfusion/ej2-dropdowns/styles/material.css'
import '@syncfusion/ej2-navigations/styles/material.css'
import '@syncfusion/ej2-splitbuttons/styles/material.css'
import '@syncfusion/ej2-react-schedule/styles/material.css'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'


// Component for schedule
const Schedule = ({ logWork }) => {
  const fieldsData = {
    id: 'issueid',
    subject: { name: 'SUMMARY' },
    description: { name: 'timeworked' },
    startTime: { name: 'STARTDATE' },
    endTime: { name: 'STARTDATE' }
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
      'SUMMARY': item.summary,
      'timeworked': `Project Key: ${item.key}\n\n Log Time: ${item.timeworked / 3600}h`,
      'CREATED': item.created,
      'UPDATED': item.updated,
      'STARTDATE': item.startdate
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
            'SUMMARY': item.summary,
            'timeworked': `Project Key: ${item.key}\n\n Log Time: ${item.timeworked / 3600}h`,
            'CREATED': item.created,
            'UPDATED': item.updated,
            'STARTDATE': item.startdate
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

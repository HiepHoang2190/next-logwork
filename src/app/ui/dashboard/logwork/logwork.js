'use client'
import { userAdmin } from '@/app/lib/variable'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import UserSelection from './logworkUserSelection'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { updateQueryParam } from '@/app/lib/logWorkTableAction'
import LogWorkDatePicker from '@/app/ui/dashboard/logwork/logworkDatePicker'

const Calendar = ({ logWork }) => {

  const calendarRef = useRef(null);
  const searchParams = useSearchParams();
  const year = searchParams.get('year') || new Date().getFullYear();
  const month = searchParams.get('month') || new Date().getMonth() + 1;

  const events = logWork.map((item) => ({
    id: item.issueid,
    title: item.timeworked,
    start: item.STARTDATE,
    allDay: true,
    editable: false,
  }))

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const date = new Date(Date.UTC(year, month - 1))
      calendarApi.gotoDate(date);
    }
  }, [year, month]);

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin]}
        themeSystem="Simplex"
        events={events}
        headerToolbar={{
          left: "title",
          center: "",
          right: ""
        }}
      />
    </>

  )
}

// Main component
const LogWorksUi = (props) => {
  const { dataIssue, dataUserName, dataAllUser } = props;
  const isUserAdmin = userAdmin.includes(dataUserName);

  const [logWork, setLogWork] = useState([]);
  const [userName, setUserName] = useState('');

  const searchParams = useSearchParams();
  const { replace } = useRouter();

  useEffect(() => {

    const newLogWork = dataIssue.map((item) => ({
      'issueid': item.issueid,
      'SUMMARY': `${item.key}: ${item.summary}`,
      'timeworked': `${item.key}: ${item.summary}.\n\nLog Time: ${item.timeworked / 3600}h`,
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

  }, [dataIssue, searchParams]);

  const handleChange = async (event) => {
    setUserName(event.target.value);
    updateQueryParam('username', event.target.value, searchParams, replace);
  };

  return (
    <div className="mt-3">
      <div className='wrapper-datetime-calendar'>
        <LogWorkDatePicker />
        {isUserAdmin &&
          <UserSelection userName={userName} handleChange={handleChange} dataAllUser={dataAllUser} />
        }
      </div>
      <Calendar logWork={logWork} />
    </div>
  );
};

export default LogWorksUi;

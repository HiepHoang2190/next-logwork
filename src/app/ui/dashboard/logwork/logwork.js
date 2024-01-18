'use client'
import { userAdmin } from '@/app/lib/variable'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import UserSelection from './logworkUserSelection'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { updateQueryParam } from '@/app/lib/logWorkAction'
import LogWorkDatePicker from '@/app/ui/dashboard/logwork/logworkDatePicker'
import CalendarModal from '@/app/ui/dashboard/logwork/modal'
import styles from "./logwork.module.css";

const Calendar = ({ logWork }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState();

  const calendarRef = useRef(null);
  const searchParams = useSearchParams();

  const year = searchParams.get('year') || new Date().getFullYear();
  const month = searchParams.get('month') || new Date().getMonth() + 1;

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <div className={styles.fcContent}>
          <div className={styles.eventTitle}>{eventInfo.event.title}</div>
        </div>
      </>
    );
  };

  const events = logWork.map((item) => ({
    id: item.issueid,
    title: item.timeworked,
    start: item.STARTDATE,
    desccription: item.comment,
    worklog: item.worklog,
    summary: item.SUMMARY,
    key: item.key,
    startdate: item.STARTDATE,
    allDay: true,
    editable: false,
  }))

  const handleDateClick = (arg) => {
    arg.jsEvent.preventDefault();
    setModalContent(arg.event.extendedProps);
    setIsOpen(true);
  };

  const setting = {
    plugins: [
      dayGridPlugin,
      listPlugin,
      interactionPlugin
    ],
    //Main Key
    eventSources: [
      {
        events: events,
        className: styles.calEvents
      }
    ],
    eventClick: handleDateClick,
    
    initialView: "dayGridMonth",
    
    headerToolbar: {
      left: "title",
      center: "",
      right: ""
    },
    
    eventTimeFormat: {
      hour: "numeric",
      minute: "2-digit",
      meridiem: "short"
    },
    
    eventContent: renderEventContent
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const date = new Date(Date.UTC(year, month - 1))
      calendarApi.gotoDate(date);
    }
  }, [year, month, calendarRef]);

  return (
    <>
      <FullCalendar {...setting} ref={calendarRef} />
      <CalendarModal open={isOpen} modalContent={modalContent} onClose={() => setIsOpen(false)}/>
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
      'key': `${item.key}`,
      'SUMMARY': `${item.summary}`,
      'timeworked': `${item.key}: ${item.summary}`,
      'CREATED': item.created,
      'UPDATED': item.updated,
      'STARTDATE': item.startdate,
      'comment': item.comment,
      'worklog': `${item.timeworked / 3600}h`
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

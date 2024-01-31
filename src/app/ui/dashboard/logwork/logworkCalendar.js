"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import listPlugin from "@fullcalendar/list";
import CalendarModal from "@/app/ui/dashboard/logwork/modal";
import styles from "./logwork.module.css";

const Calendar = ({ logWork }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState();
  const calendarRef = useRef(null);
  const searchParams = useSearchParams();

  const year = searchParams.get("year") || new Date().getFullYear();
  const month = searchParams.get("month") || new Date().getMonth() + 1;

  const renderEventContent = (eventInfo) => (
    <div className={styles.fcContent}>
      <div className={styles.eventTitle}>{eventInfo.event.title}</div>
    </div>
  );

  const events = logWork.map((item) => ({
    id: item.issueid,
    title: item.timeworked,
    start: item.STARTDATE,
    description: item.comment,
    worklog: item.worklog,
    summary: item.SUMMARY,
    key: item.key,
    startdate: item.STARTDATE,
    allDay: true,
    editable: false,
  }));

  const handleDateClick = (arg) => {
    arg.jsEvent.preventDefault();
    setModalContent(arg.event.extendedProps);
    setIsOpen(true);
  };

  const settings = {
    plugins: [dayGridPlugin, listPlugin, interactionPlugin],
    eventSources: [
      {
        events,
        className: styles.calEvents,
      },
    ],
    eventClick: handleDateClick,
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "title",
      center: "",
      right: "",
    },
    eventTimeFormat: {
      hour: "numeric",
      minute: "2-digit",
      meridiem: "short",
    },
    eventContent: renderEventContent,
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const date = new Date(Date.UTC(year, month - 1));
      calendarApi.gotoDate(date);
    }
  }, [year, month, calendarRef]);

  return (
    <>
      <FullCalendar {...settings} ref={calendarRef} />
      <CalendarModal
        open={isOpen}
        modalContent={modalContent}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default Calendar;

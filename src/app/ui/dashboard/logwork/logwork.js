"use client";

import React, { useEffect, useState } from "react";
import { userAdmin } from "@/app/lib/variable";
import { updateQueryParam } from "@/app/lib/logWorkAction";
import { useRouter, useSearchParams } from "next/navigation";
import Calendar from "@/app/ui/dashboard/logwork/logworkCalendar";
import UserSelection from "@/app/ui/dashboard/logwork/logworkUserSelection";
import LogWorkDatePicker from "@/app/ui/dashboard/logwork/logworkDatePicker";

const LogWorksUi = (props) => {
  const { dataIssue, dataUserName, dataAllUser } = props;
  const isUserAdmin = userAdmin.includes(dataUserName);

  const [logWork, setLogWork] = useState([]);
  const [userName, setUserName] = useState("");

  const searchParams = useSearchParams();
  const paramsUserName = searchParams.get("username");

  const { replace } = useRouter();

  const newLogWork = dataIssue.map((item) => ({
    issueid: item.issueid,
    key: `${item.key}`,
    SUMMARY: `${item.summary}`,
    timeworked: `${item.key}: ${item.summary}`,
    CREATED: item.created,
    UPDATED: item.updated,
    STARTDATE: item.startdate,
    comment: item.comment,
    worklog: `${item.timeworked / 3600}h`,
  }));

  useEffect(() => {
    setLogWork(newLogWork);

    if (paramsUserName) {
      setUserName(paramsUserName);
    }
  }, [dataIssue, searchParams]);

  const handleChange = async (event) => {
    setUserName(event.target.value);
    updateQueryParam("username", event.target.value, searchParams, replace);
  };

  return (
    <div className="mt-3">
      <div className="wrapper-datetime-calendar">
        <LogWorkDatePicker />
        {isUserAdmin && (
          <UserSelection
            userName={userName}
            handleChange={handleChange}
            dataAllUser={dataAllUser}
          />
        )}
      </div>
      <Calendar logWork={logWork} />
    </div>
  );
};

export default LogWorksUi;
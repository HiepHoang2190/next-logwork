"use client";

import { auth } from "@/app/auth";
import { getAllDataUser, getUserIssues } from "@/app/lib/fetchApi";
import { filterWorklogsByAuthor } from "@/app/lib/logWorkAction";
import React, { useEffect, useState } from "react";
import { userAdmin } from "@/app/lib/variable";
import { updateQueryParam } from "@/app/lib/logWorkAction";
import { useRouter, useSearchParams } from "next/navigation";
import Calendar from "@/app/ui/dashboard/logwork/logworkCalendar";
import UserSelection from "@/app/ui/dashboard/logwork/logworkUserSelection";
import LogWorkDatePicker from "@/app/ui/dashboard/logwork/logworkDatePicker";
import Unauthorized from "@/app/ui/dashboard/unauthorized/unauthorized";
import Loading from "@/app/ui/dashboard/loading/loading";

const LogWorksUi = ({searchParams}) => {
  
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);

  const [error, setError] = useState(null);


  const [logWork, setLogWork] = useState([]);

  const [userName, setUserName] = useState("");

  const isUserAdmin = userAdmin.includes(data?.user?.username);

  const paramsUserName = searchParams?.username;

  const { replace } = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const year = searchParams?.year || new Date().getFullYear();
        const month = searchParams?.month || new Date().getMonth() + 1;
        //Get User Info
        const { user } = await auth();
        
        var username = searchParams?.username;
        
        username = username !== undefined ? username : user.username;

        const dataAllUser = await getAllDataUser();
        
        const dataUsers = await getUserIssues(username, year, month);

        console.log(username, year, month)

        console.log(dataUsers.issues)

        if (dataUsers === "Unauthorized!" || dataAllUser === "fetch failed") {
          setError(dataUsers || "fetch failed");
          return;
        }

        const userLogwork = await filterWorklogsByAuthor(
          dataUsers.issues,
          username,
          month,
          year
        );


        setData({
          user,
          username,
          dataAllUser,
          userLogwork,
          month,
          year,
        });

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);


  const newLogWork = data?.userLogwork.map((item) => ({
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

  }, [data?.userLogwork, searchParams]);

  
  const handleChange = async (event) => {
    setUserName(event.target.value);
    updateQueryParam("username", event.target.value, searchParams, replace);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Unauthorized status={error} />;
  }

  return (
    <div className="mt-3">
      <div className="wrapper-datetime-calendar">
        <LogWorkDatePicker />
        {isUserAdmin && (
          <UserSelection
            userName={userName}
            handleChange={handleChange}
            dataAllUser={data.dataAllUser}
          />
        )}
      </div>
      <Calendar logWork={logWork} />
    </div>
  );
};

export default LogWorksUi;
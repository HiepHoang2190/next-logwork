import { getWorklogCurrentIssue } from "@/app/lib/fetchApi";

//Filter Issues Data by year and month
export const processData = (data, year_url, month) => {
  const yearRequest = year_url || new Date().getFullYear().toString().slice(-2);
  return data?.filter(({ startdate }) => {
    const createDate = new Date(startdate);
    const monthLog = createDate.getMonth() + 1;
    const yearLog = createDate.getFullYear().toString().slice(-2);
    return monthLog === Number(month) && yearLog === yearRequest;
  });
};

//Group data to map table report
export const groupData = (data) => {
  var arr_group = [];

  data &&
    data.forEach((value) => {
      // console.log(value)
      const logDay = new Date(value.startdate).getDate().toString();

      if (arr_group[value.key]) {
        if (arr_group[value.key].logs[logDay]) {
          console.log();
          arr_group[value.key].logs[logDay].comment += ` ${value.comment}`;
          arr_group[value.key].logs[logDay].timeworked += Number(
            value.timeworked
          );
        } else {
          arr_group[value.key].logs[logDay] = {
            comment: value.comment,
            timeworked: Number(value.timeworked),
            created: value.startdate,
          };
        }
      } else {
        arr_group[value.key] = {
          key: value.key,
          pkey: value.pkey,
          summary: value.summary,
          logs: {
            [logDay]: {
              comment: value.comment,
              timeworked: Number(value.timeworked),
              created: value.startdate,
            },
          },
        };
      }
    });
  return arr_group;
};

export const logTimeTotal = (arrLog = []) => {
  const t =
    arrLog &&
    arrLog.reduce(function (a, b) {
      return Number(a) + Number((b["timeworked"] / 3600).toFixed(2));
    }, 0);
  return t;
};

export const logCommentElement = (arrLog = [], ind) => {
  let comment = null;

  arrLog?.forEach((element) => {
    const createDate = element["created"]?.substring(0, 10);
    const get_day = createDate?.split("-")[2];

    if (Number(ind) === Number(get_day)) {
      comment = element["comment"];
    }
  });

  return comment;
};

export const logTimeElement = (arrLog = [], ind) => {
  let timeworked = null;

  arrLog?.forEach((element) => {
    const createDate = element["created"]?.substring(0, 10);
    const get_day = createDate?.split("-")[2];

    if (Number(ind) === Number(get_day)) {
      timeworked = Number((element["timeworked"] / 3600).toFixed(2));
    }
  });

  return timeworked;
};

export const logTimeTotalIssue = (arrLog = []) => {
  return arrLog
    .filter(({ pkey }) => pkey !== "LRM")
    .reduce((total, item) => {
      const logTime = Object.values(item["logs"]).reduce(
        (a, b) => a + Number((b["timeworked"] / 3600).toFixed(2)),
        0
      );

      return total + logTime;
    }, 0);
};

export const logTimeTotalIssueByDay = (arrLog = [], numberDay) => {
  let final = 0;
  arrLog = arrLog.filter((item) => item.pkey !== "LRM");
  arrLog.forEach((item) => {
    let t2 = 0;
    Object.values(item["logs"]).forEach((item2) => {
      const createDate = item2["created"] && item2["created"].substring(0, 10);
      const createDate_arr = createDate.split("-");
      const get_day = createDate_arr[2];
      if (Number(numberDay) === Number(get_day)) {
        const ts = Number((item2["timeworked"] / 3600).toFixed(2));
        t2 += ts;
      }
    });
    final += t2;
  });
  return final;
};

export const getDatefromDay = (day, month, year) => {
  const fullDate = new Date(year, month - 1, day);
  return fullDate
    .toLocaleString("en-us", { weekday: "short" })
    .toUpperCase()
    .slice(0, 2);
};

export const updateQueryParam = (key, value, searchParams, replace) => {
  const params = new URLSearchParams(searchParams);
  value ? params.set(key, value) : params.delete(key);
  replace(`?${params}`);
};

export const lastDayOfMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const formatTime = (timeString) => {
  const originalDate = new Date(timeString);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour clock
    timeZone: "Asia/Bangkok", // Set the desired timezone (UTC+7)
  };

  const convertTimeZone = originalDate.toLocaleString("en-US", options); // UTC+7
  const [datePart, timePart] = convertTimeZone.split(", ");
  const [month, day, year, hours, minutes, seconds] = datePart
    .split("/")
    .concat(timePart.split(":"));

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const filterWorklogs = (worklogs, month, year) => {
  const targetDate = new Date(year, month - 1); // Create target date outside the loop
  return worklogs.filter((worklog) => {
    const startedDate = new Date(worklog.started);
    return (
      startedDate.getMonth() === targetDate.getMonth() &&
      startedDate.getFullYear() === targetDate.getFullYear()
    );
  });
};

export const filterWorklogsByAuthor = async (data, authorName, month, year) => {
  const newData = [];
  for (const item of data) {
    if (item.fields.worklog.total > 20) {
      try {
        const additionalWorklogs = await getWorklogCurrentIssue(item.key);
        item.fields.worklog.worklogs.push(...additionalWorklogs.worklogs);
      } catch (error) {
        console.error(
          `Error fetching additional worklogs for ${item.key}:`,
          error
        );
      }
    }
    const filteredWorklogs = item.fields.worklog.worklogs.filter(
      (worklog) => worklog.author.name === authorName
    );
    const filterWorklogsByMonth = filterWorklogs(filteredWorklogs, month, year);
    const uniqueWorklogs = filterWorklogsByMonth.reduce((unique, worklog) => {
      const existingIndex = unique.findIndex((w) => w.id === worklog.id);
      if (existingIndex === -1) {
        unique.push(worklog);
      }
      return unique;
    }, []);
    const workLogsFlat = uniqueWorklogs.map((filteredWorklog) => ({
      author: filteredWorklog.author.key,
      comment: filteredWorklog.comment,
      created: formatTime(filteredWorklog.created),
      startdate: formatTime(filteredWorklog.started),
      updated: formatTime(filteredWorklog.updated),
      logworkId: filteredWorklog.id,
      summary: item.fields.summary,
      timeworked:
        item.fields.project.key === "LRM"
          ? -filteredWorklog.timeSpentSeconds
          : filteredWorklog.timeSpentSeconds,
      key: item.key,
      pkey: item.key.split("-")[0],
      issueid: item.id,
    }));
    newData.push(...workLogsFlat);
  }
  return newData;
};

const padTo2Digits = (num) => num.toString().padStart(2, "0");

export const formatDate = (date) =>
  [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join("-");

export const processLeaveItem = (item) => {
  const dd = item.create_date.split("-");
  const yearLeave = dd[0].substr(2);
  const date1 = new Date(item.create_date);
  const date2 = new Date(item.start_date);
  const date3 = new Date(item.due_date);
  const difference_in_time = date2.getTime() - date1.getTime();
  const difference_in_days = difference_in_time / (1000 * 3600 * 24);
  const createDateFormat = formatDate(date1);
  const startDateFormat = formatDate(date2);
  const dueDateFormat = formatDate(date3);
  const currentYear = new Date().getFullYear();
  if (date1.getFullYear() === currentYear) {
    return {
      creator: item.creator,
      summary: item.summary,
      desc: item.desc,
      create_date: createDateFormat,
      due_date: dueDateFormat,
      id: item.id,
      start_date: startDateFormat,
      year_leave: yearLeave,
      current_year: currentYear,
      difference_in_days: difference_in_days,
    };
  }
  return null;
};

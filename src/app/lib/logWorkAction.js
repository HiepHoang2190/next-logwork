import { getWorklogCurrentIssue } from '@/app/lib/fetchApi'

//Filter Issues Data by year and month
export const processData = (data, year_url, month) => {
    var yearRequest = year_url || new Date().getFullYear().toString().substr(-2);
    return data && data.filter((el) => {
        var createDate = el.startdate && el.startdate.substring(0, 10);
        var monthLog = new Date(createDate).getMonth() + 1;
        var yearLog = new Date(createDate).getFullYear().toString().substr(-2);
        return monthLog == month && yearLog == yearRequest;
    });
};

//Group data to map table report
export const groupData = (data) => {
    var arr_group = [];

    data && data.forEach((value) => {
        const logDay = new Date(value.startdate).getDate().toString();

        if (arr_group[value.key]) {

            // Check if there is already an entry for the current day
            const existingLogIndex = arr_group[value.key].logs.findIndex(log => new Date(log.created).getDate().toString() === logDay);

            if (existingLogIndex !== -1) {
                // If the entry for the day exists, remove it
                arr_group[value.key].logs.splice(existingLogIndex, 1);
            }
            // Add a new entry for the current day
            arr_group[value.key].logs.push({
                comment: value.comment,
                timeworked: Number(value.timeworked),
                created: value.startdate
            });

        } else {
            // If the key doesn't exist, create a new entry
            arr_group[value.key] = {
                key: value.key,
                pkey: value.pkey,
                summary: value.summary,
                logs: [
                    {
                        comment: value.comment,
                        timeworked: Number(value.timeworked),
                        created: value.startdate
                    }
                ]
            };
        }
    });
    return arr_group;
};

export const logTimeTotal = (arrLog = []) => {
    const t = arrLog && arrLog.reduce(function (a, b) {
        return Number(a) + Number((b['timeworked'] / 3600).toFixed(2))
    }, 0)
    return (t)
}

export const logTimeElement = (arrLog = [], ind) => {

    let timeworked
    let day_worked
    {
        arrLog && arrLog.map((element) => {

            var createDate = element['created'] && element['created'].substring(0, 10)
            var createDate_arr = createDate.split('-')
            var get_day = createDate_arr[2]
            if (Number(ind) == get_day) {
                timeworked = Number((element['timeworked'] / 3600).toFixed(2))
                day_worked = get_day
            }
        })
    }
    if (timeworked) {
        return timeworked
    } else {
        return null
    }
}

export const logTimeTotalIssue = (arrLog = []) => {
    const final = arrLog && arrLog
        .map((item) =>
            Object.values(item['logs']).reduce((a, b) => Number(a) + Number((b['timeworked'] / 3600).toFixed(2)), 0)
        )
        .reduce((prev, curr) => prev + curr, 0);

    return final;
};

export const logTimeTotalIssueByDay = (arrLog = [], numberDay) => {
    let final = 0;
    let t2 = 0;

    arrLog && arrLog.forEach((item) => {
        Object.values(item['logs']).forEach((item2) => {
            const createDate = item2['created'] && item2['created'].substring(0, 10);
            const createDate_arr = createDate.split('-');
            const get_day = createDate_arr[2];

            if (Number(numberDay) === Number(get_day)) {
                const ts = Number((item2['timeworked'] / 3600).toFixed(2));
                t2 += ts;
            }
        });
        final = t2;
    });
    return final;
};

export const getDatefromDay = (day, thismonth, thisyear) => {
    const fullday = `${thismonth}/${day}/${thisyear}`;
    const dt = new Date(fullday);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dt.getDay()].toUpperCase().slice(0, 2);
};

export const updateQueryParam = (key, value, searchParams, replace) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
        params.set(key, value);
    } else {
        params.delete(key);
    }

    replace(`?${params}`);
};

export const lastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
}

const formatTime = (timeString) => {
    const originalDate = new Date(timeString);
    const year = originalDate.getUTCFullYear();
    const month = (originalDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = originalDate.getUTCDate().toString().padStart(2, '0');
    const hours = originalDate.getUTCHours().toString().padStart(2, '0');
    const minutes = originalDate.getUTCMinutes().toString().padStart(2, '0');
    const seconds = originalDate.getUTCSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const filterWorklogs = (worklogs, month, year) => {
    return worklogs.filter(worklog => {
        const startedDate = new Date(worklog.started);
        const worklogMonth = startedDate.getMonth() + 1; // Month is zero-based
        const worklogYear = startedDate.getFullYear();

        return (worklogMonth == month && worklogYear == year);
    });
}

export const filterWorklogsByAuthor = async (data, authorName, month, year) => {

    const newData = await Promise.all(
        
        data.map(async (item) => {
            // Check if worklog total is greater than 20
            if (item.fields.worklog.total > 20) {
                try {
                    // Call API getWorklogCurrentIssue(key) to get all worklogs
                    const additionalWorklogs = await getWorklogCurrentIssue(item.key);

                    // Merge additional worklogs with existing worklogs
                    item.fields.worklog.worklogs = [
                        ...item.fields.worklog.worklogs,
                        ...additionalWorklogs.worklogs,
                    ];
                } catch (error) {
                    console.error(`Error fetching additional worklogs for ${item.key}:`, error);
                }
            }

            // Filter worklogs by authorName
            const filteredWorklogs = item.fields.worklog.worklogs.filter(
                (worklog) => worklog.author.name === authorName
            );

            // Filter worklogs by month and year
            const filterWorklogsByMonth = filterWorklogs(filteredWorklogs, month, year);

            // Transform and return the filtered worklogs
            return filterWorklogsByMonth.map((filteredWorklog) => ({
                author: filteredWorklog.author.key,
                comment: filteredWorklog.comment,
                created: formatTime(filteredWorklog.created),
                startdate: formatTime(filteredWorklog.started),
                updated: formatTime(filteredWorklog.updated),
                summary: item.fields.summary,
                timeworked: filteredWorklog.timeSpentSeconds,
                key: item.key,
                pkey: item.key.split('-')[0],
                issueid: item.id,
            }));
        })
    );

    return newData.flat();
};
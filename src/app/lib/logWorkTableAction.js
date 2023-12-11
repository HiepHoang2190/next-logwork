export const processData = (data, year_url, month) => {
    var yearRequest = year_url || new Date().getFullYear().toString().substr(-2);
    return data && data.filter((el) => {
        var createDate = el.STARTDATE && el.STARTDATE.substring(0, 10);
        var monthLog = new Date(createDate).getMonth() + 1;
        var yearLog = new Date(createDate).getFullYear().toString().substr(-2);
        return monthLog == month && yearLog == yearRequest;
    });
};

export const groupData = (data) => {
    var arr_group = [];

    data && data.forEach((value) => {
        const logDay = new Date(value.STARTDATE).getDate().toString();

        if (arr_group[value.key]) {
            if (arr_group[value.key].logs[logDay]) {
                arr_group[value.key].logs[logDay].timeworked += Number(value.timeworked);
            } else {
                arr_group[value.key].logs[logDay] = {
                    comment: value.comment,
                    timeworked: Number(value.timeworked),
                    created: value.STARTDATE
                };
            }
        } else {
            arr_group[value.key] = {
                key: value.key,
                pkey: value.pkey,
                summary: value.SUMMARY,
                logs: {
                    [logDay]: {
                        comment: value.comment,
                        timeworked: Number(value.timeworked),
                        created: value.STARTDATE
                    }
                }
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

            var createDate = element['created'].substring(0, 10)
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
            const createDate = item2['created'].substring(0, 10);
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
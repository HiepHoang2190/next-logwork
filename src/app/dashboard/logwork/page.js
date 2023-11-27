'use client'
import styles from '@/app/ui/dashboard/logwork/logwork.module.css'
import { ScheduleComponent, Year, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule'

import '../../../../node_modules/@syncfusion/ej2-base/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-calendars/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-lists/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-popups/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css'
import '../../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css'

import { datasource } from '@/app/lib/datasource'

const  LogWorksPage = () => {

  // const fetcher = (url) => fetch(url, {
  //   method: 'GET',
  //   headers: {
  //     'Accept': 'application/json, text/plain, */*',
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  //   }
  // })
  //   .then((res) => res.json())

  // const { data, error, isLoading } = useSWR(
  //   'http://api-jira.lotustest.net/rest/V1/user/thao',
  //   fetcher,
  //   {
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false
  //   }
  // )
  // console.log(data)
  // if (isLoading) {
  //   return <div>loading...</div>
  // }


  const fieldsData = {
    id: 'issueid',
    subject: { name: 'SUMMARY' },
    description: { name: 'timeworked' },
    startTime: { name: 'CREATED' },
    endTime: { name: 'UPDATED' }
  }
  const eventSettings = { dataSource: datasource, fields: fieldsData }
  return (
    <div className="mt-3">

      <ScheduleComponent height='750px' currentView='Month' eventSettings={eventSettings}>
        <ViewsDirective>
          <ViewDirective option='Week' readonly={true}/>
          <ViewDirective option='Month' readonly={true} />
          <ViewDirective option='Day' readonly={true} />

          <ViewDirective option='Year' readonly={true} />

        </ViewsDirective>
        <Inject services={[Year, Week, Month, Day]} />
      </ScheduleComponent>

    </div>
  )
}

export default LogWorksPage
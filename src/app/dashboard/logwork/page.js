

import LogWorksUi from '../../ui/dashboard/logwork/logwork'

import { auth } from '@/app/auth'

const LogWorksPage = async () => {

  const { user } = await auth()
  const getUserIssue = async () => {
    'use server'
    const arr=[]
    const totalTimeLive = await
    fetch(`http://api-jira.lotustest.net/rest/V1/user/${user.username}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':'*',
          'Access-Control-Allow-Credentials':'true',
          'Access-Control-Allow-Headers':'X-CSRF-Token'


        }
      })
      .then(response => response.json())
      .then(data => {
        data.map((item) => (
          arr.push(item)
        ))

      })

    return arr
  }

  const dataIssue = await getUserIssue()
  return (
    <>
      <LogWorksUi dataIssue = {dataIssue} dataUserName={user.username}></LogWorksUi>
    </>

  )
}

export default LogWorksPage
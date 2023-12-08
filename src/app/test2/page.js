

import LogWorksPage2 from '../test2/uitest2'
import { auth } from '@/app/auth'

const PageLog = async () => {

  const { user } = await auth()
  const getUserIssue = async () => {
    'use server'
    const arr=[]
    const totalTimeLive = await
    fetch(`${process.env.API_PATH}/V1/user/${user.username}`,
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
      <LogWorksPage2 dataIssue = {dataIssue} dataUserName={user.username}></LogWorksPage2>
    </>

  )
}

export default PageLog
import { NextResponse } from 'next/server'

export async function POST(request) {
  const data = await request.json()
  const arr=[]
  if (data.username) {
    const totalTimeLive = await
    fetch(`http://api-jira.lotustest.net/rest/V1/user/${data.username}`,
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
  } else {
    return NextResponse.json({ error: 'user not found' })
  }

  // Return a response
  return NextResponse.json({ message: arr })
}
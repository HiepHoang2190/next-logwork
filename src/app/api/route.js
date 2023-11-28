export const dynamic = 'force-dynamic' // defaults to force-static
export async function getLogWork() {
  const res = await fetch('http://api-jira.lotustest.net/rest/V1/user/thao', {
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
  const data = await res.json()

  return data
}
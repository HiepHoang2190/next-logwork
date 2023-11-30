
export default async function getLogWork() {
  const response = await fetch('http://localhost:8000/dataUserAction', {
   				method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://192.168.11.153:3001',
      'Access-Control-Allow-Methods':'*',
      'Access-Control-Allow-Credentials':'true',
      'Access-Control-Allow-Headers':'X-CSRF-Token'
    }
  })

  if (!response.ok) {
    throw new Error('failed to fetch users')
  }

  return await response.json()
}
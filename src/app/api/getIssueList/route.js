import { NextResponse } from 'next/server'

export async function POST(request) {
  const data = await request.json()
  console.log(data)


  // Return a response
  return NextResponse.json({ message: 'User added successfully2' })
}
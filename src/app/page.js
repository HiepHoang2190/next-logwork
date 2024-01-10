'use client'
import { useRouter } from 'next/navigation'

export default function Home({ children }) {
  const router = useRouter()
  router.push('/dashboard')

  return (
    <>
      {children}
    </>
  )
}

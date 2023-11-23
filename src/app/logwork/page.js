'use client'
import { useRouter } from 'next/navigation'
// import Button from 'react-bootstrap/Button'


const Facebook = () => {
  const router = useRouter()
  const handleBtn = () => {
    router.push('/')
  }
  return (
    <div>
				Logwork Page
      <div>
        {/* <Button variant='primary'>Back Home</Button> */}
        <button onClick={() => handleBtn()}>Back Home</button>
      </div>
    </div>
  )
}

export default Facebook
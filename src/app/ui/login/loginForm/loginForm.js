'use client'


import { authenticate } from '@/app/lib/actions'
import styles from './loginForm.module.css'
import { useFormState } from 'react-dom'
import { useState, useEffect } from 'react'
import React, { useRef, Component } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, auth } from 'next-auth/react'

import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))
// ** Configs
import themeConfig from '@/app/configs/themeConfig'

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginForm = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  // const [err, setErr] = useState()
  const handleLogin = async (formData) => {

    console.log(formData)
    // const data = await authenticate(formData)
    // data.error && setErr(data.error)
  }

  // ** State
  const [values, setValues] = useState({
    username:'',
    password: '',
    showPassword: false
  })

  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }


  const [err, setErr] = useState()

  const sendValue = async () => {
    const data = await authenticate(values)
    console.log('data', data)

    if (!data?.error) {
      // console.log('data',data)
      toast.success('Login succeed !')
      router.push('/dashboard')
      router.refresh()
    } else {
      toast.error(data?.error)
      // data.error && setErr(data.error)
    }
  }
  return (

    <>
      {/* <form action={handleLogin} className={styles.form}>
        <h1>Login</h1>
        <input type="text" placeholder="username" name="username" />
        <input type="password" placeholder="password" name="password" />
        <button>Login</button>
        {state && state}
      </form> */}
      {mounted &&
 <Box className='content-center'>
   <Card sx={{ zIndex: 1 }}>
     <CardContent >

       <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <img style={{ textAlign: 'center', marginBottom: '0px' }} src="/jira-logo.png"/>
       </Box>
       <Box sx={{ mb: 6 }}>
         <Typography variant='h5' className={styles.text_center} sx={{ fontWeight: 600, marginBottom: 1.5 }}>
       Welcome to Lotus! 👋🏻
         </Typography>
       </Box>
       <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
         <TextField onChange={handleChange('username')} autoFocus fullWidth id='username' label='Username' sx={{ marginBottom: 4 }} />
         <FormControl fullWidth>
           <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
           <OutlinedInput
             label='Password'
             value={values.password}
             id='auth-login-password'
             onChange={handleChange('password')}
             type={values.showPassword ? 'text' : 'password'}
             endAdornment={
               <InputAdornment position='end'>
                 <IconButton
                   edge='end'
                   onClick={handleClickShowPassword}
                   onMouseDown={handleMouseDownPassword}
                   aria-label='toggle password visibility'
                 >
                   {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                 </IconButton>
               </InputAdornment>
             }
           />
         </FormControl>
         <Box
           sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
         >
           <FormControlLabel control={<Checkbox />} label='Remember Me' />
           <Link passHref href='/'>
             <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
           </Link>
         </Box>
         <Button
           fullWidth
           size='large'
           variant='contained'
           sx={{ marginBottom: 7 }}
           onClick={sendValue}
         >
       Login
         </Button>
         <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>

           <Typography variant='body2'>
             {err && err}
           </Typography>
         </Box>


       </form>
     </CardContent>
   </Card>

 </Box>

      }


    </>

  )
}

export default LoginForm

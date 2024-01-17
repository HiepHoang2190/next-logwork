'use client'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import styles from './loginForm.module.css'
import 'react-toastify/dist/ReactToastify.css'
import { authenticate } from '@/app/lib/fetchApi'
import React, { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LoginForm = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ** State
  const [values, setValues] = useState({
    username: '',
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
   
    if (!data?.error) {
      toast.success(data?.success)
      router.push('/dashboard')
      router.refresh()
    } else {
      toast.error(data?.error)
    }
  }
  return (

    <>
      {mounted &&
        <Box className='content-center'>
          <Card sx={{ zIndex: 1 }}>
            <CardContent >

              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img style={{ textAlign: 'center', marginBottom: '0px' }} src="/jira-logo.png" />
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant='h5'
                  className={styles.text_center}
                  sx={{ fontWeight: 600, marginBottom: 1.5 }}
                >
                  Welcome to Lotus! 👋🏻
                </Typography>
              </Box>

              <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
                <TextField
                  onChange={handleChange('username')}
                  autoFocus
                  fullWidth
                  id='username'
                  label='Username'
                  sx={{ marginBottom: 4 }}
                />

                <FormControl fullWidth  sx={{ mb: 4 }}>
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

                <Button
                  fullWidth
                  size='large'
                  variant='contained'
                  sx={{ marginBottom: 7 }}
                  onClick={sendValue}
                >
                  Login
                </Button>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
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

'use client'
import React from 'react';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import errorPic from '../../public/error.png'
import { Box, Container, Typography } from '@mui/material';

const Error = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2} sx={{
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          <Grid xs={6}>
            <Typography variant="h1">
              Woops!
            </Typography>
            <Typography variant="h6" sx={{ marginTop: "10px", marginBottom: "15px" }}>
              Something when wrong!
            </Typography>
            <Typography variant="p">
              Please try again later
            </Typography>
          </Grid>
          <Grid xs={6}>
            <Image
              src={errorPic}
              alt="Error Picture"
              width={500}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Error
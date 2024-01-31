"use client";

import React from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import errorPic from "../../public/error.png";
import { Box, Container, Typography } from "@mui/material";

const Error = () => {
  return (
    <Box
      sx={{
        minHeight: "865px",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          minHeight: "inherit",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            marginTop: "0",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "inherit",
          }}
        >
          <Grid
            sx={{
              margin: "0 10px",
            }}
          >
            <Typography variant="h1">Woops!</Typography>
            <Typography
              variant="h6"
              sx={{ marginTop: "10px", marginBottom: "15px" }}
            >
              Something when wrong!
            </Typography>
            <Typography variant="p">Please try again later</Typography>
          </Grid>
          <Grid
            sx={{
              margin: "0px 10px",
              textAlign: "center",
            }}
          >
            <Image src={errorPic} alt="Error Picture" width={500} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Error;

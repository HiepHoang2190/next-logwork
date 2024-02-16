"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "./loginForm.module.css";
import "react-toastify/dist/ReactToastify.css";
import { authenticate } from "@/app/lib/fetchApi";
import React, { useState, useEffect } from "react";

// ** MUI Components
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "500px" },
}));

const labelStyles = {
  "&.MuiFormLabel-root.MuiInputLabel-root": {
    color: "#848484",
    fontSize: "20px",
    fontWeight: "400",
    lineHeight: "23.45px",
    top: "4px",
    left: "5px",
  },
  "&.MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-shrink": {
    top: "0px",
    left: "-3px",
  },
  "~.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary fieldset > legend > span": {
    paddingRight: "13px",
  }
};

const inputStyles = {
  "&.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl": {
    borderRadius: "16px",
  },
  "&.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl input#username": {
    padding: "20px",
  },
  "&.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl input#auth-login-password": {
    padding: "20px 0px 20px 20px",
  },
};

const buttonStyles = {
  "&.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary":
    {
      padding: "20px",
      borderRadius: "16px",
      background: "linear-gradient(90deg, #180110 0%, #D41E8E 201.53%)",
      fontSize: "20px",
      fontWeight: "500",
      lineHeight: "23.45px",
    },
  "&.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary:hover":
    {
      boxShadow:" 0px 0px 0px 2px var( --colorLotus)"
    },
};

const LoginForm = () => {
  // ** State
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState({
    username: "",
    password: "",
    showPassword: false,
  });

  // ** Hook
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const sendValue = async () => {
    const newValues = {
      username: values.username.toLowerCase(),
      password: values.password,
      showPassword: values.showPassword,
    };

    const data = await authenticate(newValues);

    if (!data?.error) {
      toast.success(data?.success);
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error(data?.error);
    }
  };

  return (
    <>
      {mounted && (
        <Box className="content-center">
          <Card sx={{ zIndex: 1, borderRadius: "24px" }}>
            <CardContent
              sx={{ padding: "36px", paddingBottom: "36px !important" }}
            >
              <Box
                sx={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ textAlign: "center", marginBottom: "0px" }}
                  src="/jira-logo.png"
                />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  className={styles.text_center}
                  sx={{
                    fontWeight: 600,
                    fontSize: "32px",
                    lineHeight: "37.5px",
                    marginBottom: "32px",
                  }}
                >
                  Welcome to Lotus!
                </Typography>
              </Box>

              <form
                noValidate
                autoComplete="off"
                onSubmit={(e) => e.preventDefault()}
              >
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel htmlFor="username" sx={{ ...labelStyles }}>
                    Username
                  </InputLabel>

                  <OutlinedInput
                    sx={{ ...inputStyles }}
                    label="Username"
                    id="username"
                    onChange={handleChange("username")}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel
                    htmlFor="auth-login-password"
                    sx={{ ...labelStyles }}
                  >
                    Password
                  </InputLabel>

                  <OutlinedInput
                    sx={{ ...inputStyles, paddingRight: "20px" }}
                    label="Password"
                    value={values.password || undefined}
                    id="auth-login-password"
                    onChange={handleChange("password")}
                    type={values.showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label="toggle password visibility"
                        >
                          {values.showPassword ? (
                            <EyeOutline />
                          ) : (
                            <EyeOffOutline />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{ ...buttonStyles }}
                  onClick={sendValue}
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
};

export default LoginForm;

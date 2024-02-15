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

const LoginForm = () => {
  // ** State
  const [err, setErr] = useState();
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
                  <InputLabel
                    htmlFor="username"
                    sx={{
                      padding: "4px 5px",
                      fontSize: "20px",
                      fontWeight: "400",
                      lineHeight: "23.45px",
                      color: "#848484",
                    }}
                  >
                    Username
                  </InputLabel>

                  <OutlinedInput
                    sx={{ borderRadius: "16px" }}
                    label="Username"
                    id="username"
                    onChange={handleChange("username")}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel
                    htmlFor="auth-login-password"
                    sx={{
                      padding: "4px 5px",
                      fontSize: "20px",
                      fontWeight: "400",
                      lineHeight: "23.45px",
                      color: "#848484",
                    }}
                  >
                    Password
                  </InputLabel>

                  <OutlinedInput
                    sx={{ borderRadius: "16px", paddingRight: "20px" }}
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
                  id="login-button"
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{
                    padding: "20px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(90deg, #180110 0%, #D41E8E 201.53%)",
                    fontWeight: "500",
                    fontSize: "20px",
                    lineHeight: "23.45px",
                  }}
                  onClick={sendValue}
                >
                  Login
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2">{err && err}</Typography>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
};

export default LoginForm;

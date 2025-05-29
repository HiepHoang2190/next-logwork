"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./loginForm.module.css";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import { login } from "@/app/auth";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import Cookies from "js-cookie";

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
    top: "6px",
    left: "5px",
  },
  "&.MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-shrink": {
    top: "0px",
    left: "-3px",
  },
  "~.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary fieldset > legend > span":
    {
      paddingRight: "0px",
    },
};

const inputStyles = {
  "&.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl":
    {
      borderRadius: "16px",
      fontSize: "20px"
    },
  "&.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl input#username":
    {
      padding: "20px",
      fontSize: "20px"
    },
  "&.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl input#auth-login-password":
    {
      padding: "20px 0px 20px 20px",
      fontSize: "20px"
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
      height: "63px"
    },
  "&.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.disabled":
    {
      background: "linear-gradient(90deg, #18011082 0%, #d41e8ebf 201.53%)",
      pointerEvents: "none",
    },
  "&.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary:hover":
    {
      boxShadow: " 0px 0px 0px 2px var( --colorLotus)",
    },
};

const LoginForm = () => {
  // ** State
  const [mounted, setMounted] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
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

    setIsFetch(true);
    const data = await login(newValues);

    if (data?.username !== "") {
      Cookies.set("JSESSIONID", data.session.value);
      toast.success(data?.success);
      router.push("/dashboard");
    } else {
      toast.error(data?.error);
      setIsFetch(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendValue();
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
                <FormControl fullWidth sx={{ mb: 4, fontSize:"20px" }}>
                  <InputLabel htmlFor="username" sx={{ ...labelStyles }}>
                    Username
                  </InputLabel>

                  <OutlinedInput
                    sx={{ ...inputStyles }}
                    label="Username"
                    id="username"
                    onChange={handleChange("username")}
                    onKeyDown={handleKeyDown}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 4, fontSize:"20px" }}>
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
                    onKeyDown={handleKeyDown}
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
                  className={isFetch ? "disabled" : ""}
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{ ...buttonStyles }}
                  onClick={sendValue}
                >
                  {isFetch ? (
                    <>
                      <CircularProgress
                        size={20}
                        sx={{
                          color: "white",
                          marginRight: "10px",
                          marginBottom: "2px",
                        }}
                      />
                      Login
                    </>
                  ) : (
                    "Login"
                  )}
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
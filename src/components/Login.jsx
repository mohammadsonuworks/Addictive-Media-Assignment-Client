import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { validate_email } from "../utils";
import { LOGIN_USER_ENDPOINT } from "../config";

const defaultTheme = createTheme();

export default function Login() {
  const [formAlert, setFormAlert] = React.useState({
    isVisible: false,
  });

  const validate_form_inputs = ({ email, password }) => {
    return validate_email(email) === true && password.length > 0;
  };
  const handle_submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email").trim();
    const password = data.get("password").trim();

    const isFormValid = validate_form_inputs({ email, password });
    if (isFormValid) {
      setFormAlert({
        isVisible: true,
        severity: "success",
        message: "Form values are valid. Please wait while we log you in ...",
      });
      login_user({ email, password });
    } else {
      setFormAlert({
        isVisible: true,
        severity: "error",
        message: "All fields are required and should contain valid values.",
      });
    }
  };
  const login_user = ({ email, password }) => {
    fetch(LOGIN_USER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const isLoginSuccessful = data.code === 1;
        if (isLoginSuccessful === false) {
          setFormAlert({
            isVisible: true,
            severity: "error",
            message: data.message,
          });
        } else {
          setFormAlert({
            isVisible: true,
            severity: "success",
            message: data.message,
          });
          const jwtToken = data.token;
          localStorage.setItem("token", jwtToken);
          window.location.href = "/dashboard";
        }
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handle_submit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {formAlert.isVisible && (
              <Alert
                style={{ marginTop: "1rem" }}
                severity={formAlert.severity}
              >
                {formAlert.message}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Register"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

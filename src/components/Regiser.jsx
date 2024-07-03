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
import { REGISTER_USER_ENDPOINT } from "../config";

const defaultTheme = createTheme();

export default function Register() {
  const [formAlert, setFormAlert] = React.useState({
    isVisible: false,
  });

  const validate_form_inputs = ({
    firstName,
    lastName,
    email,
    phoneNumber,
  }) => {
    return (
      firstName.length > 0 &&
      lastName.length > 0 &&
      validate_email(email) === true &&
      phoneNumber.length === 10
    );
  };
  const handle_submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get("firstName").trim();
    const lastName = data.get("lastName").trim();
    const email = data.get("email").trim();
    const phoneNumber = data.get("phoneNumber").trim();

    const isFormValid = validate_form_inputs({
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    if (isFormValid) {
      setFormAlert({
        isVisible: true,
        severity: "success",
        message: "Form values are valid. Please wait while we register you ...",
      });
      register_user({ firstName, lastName, email, phoneNumber });
    } else {
      setFormAlert({
        isVisible: true,
        severity: "error",
        message: "All fields are required and should contain valid values.",
      });
    }
  };
  const register_user = ({ firstName, lastName, email, phoneNumber }) => {
    fetch(REGISTER_USER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phoneNumber,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const isRegistrationSuccessful = data.code === 1;
        if (isRegistrationSuccessful === false) {
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
            Register
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handle_submit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  type="number"
                  id="phoneNumber"
                  autoComplete="phoneNumber"
                />
              </Grid>
            </Grid>
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
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

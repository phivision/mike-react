import React from "react";
import { Container, CssBaseline, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import SignInForm from "../../components/Authentication/SignInForm";
// import auth styles
import authStyles from "../../assets/jss/material-dashboard-react/views/authStyle";

//TODO: Setup forgot password page
//TODO: Error handling for authentication
export default function SignIn({ ...props }) {
  const classes = authStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <SignInForm {...props} />
      </div>
    </Container>
  );
}

SignIn.propTypes = {
  props: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        next: PropTypes.object,
      }),
    }),
  }),
};

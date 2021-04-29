import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import PropTypes from "prop-types";
import authStyles from "../../assets/jss/material-dashboard-react/views/authStyle";
import SignUpForm from "../../components/Authentication/SingUpForm";

export default function SignUp({ ...props }) {
  const classes = authStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <SignUpForm {...props} />
      </div>
    </Container>
  );
}

SignUp.propTypes = {
  props: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.shape({
        role: PropTypes.string,
      }),
    }),
    location: PropTypes.shape({
      state: PropTypes.shape({
        next: PropTypes.object,
      }),
    }),
  }),
};

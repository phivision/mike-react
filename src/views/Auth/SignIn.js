import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  Snackbar,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import SignInForm from "../../components/Authentication/SignInForm";
import CloseIcon from "@material-ui/icons/Close";
// import auth styles
import authStyles from "../../assets/jss/material-dashboard-react/views/authStyle";
import IconButton from "@material-ui/core/IconButton";

//TODO: Setup forgot password page
//TODO: Error handling for authentication
export default function SignIn({ ...props }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const classes = authStyles();

  const handleOpen = (e) => {
    setError(e);
    setOpen(true);
  };

  const handleClose = () => {
    setError(null);
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={error}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <SignInForm openError={handleOpen} {...props} />
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

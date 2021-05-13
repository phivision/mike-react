import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import PropTypes from "prop-types";
import authStyles from "../../assets/jss/material-dashboard-react/views/authStyle";
import SignUpForm from "../../components/Authentication/SignUpForm";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Snackbar } from "@material-ui/core";

export default function SignUp({ ...props }) {
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
          Sign up
        </Typography>
        <SignUpForm openError={handleOpen} {...props} />
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

import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import PropTypes from "prop-types";
// import auth styles
import authStyles from "../../assets/jss/material-dashboard-react/views/authStyle";
import VerifyForm from "../../components/Authentication/VerifyForm";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Snackbar } from "@material-ui/core";

export default function Verify({ ...props }) {
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
          Verify your email
        </Typography>
        <VerifyForm openError={handleOpen} {...props} />
      </div>
    </Container>
  );
}

Verify.propTypes = {
  props: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        next: PropTypes.object,
      }),
    }),
  }),
};

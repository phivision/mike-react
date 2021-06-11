import React, { useState } from "react";
import PropTypes from "prop-types";
import SignUpForm from "../../components/Authentication/SignUpForm";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Snackbar } from "@material-ui/core";
import {
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";

export default function SignUp({ ...props }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = (e) => {
    setError(e);
    setOpen(true);
  };

  const handleClose = () => {
    setError(null);
    setOpen(false);
  };

  return (
    <>
      <CustomContainer maxWidth="sm">
        <TextStyle variant="h2">Sign up</TextStyle>
        <SignUpForm openError={handleOpen} {...props} />
      </CustomContainer>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={error}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
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

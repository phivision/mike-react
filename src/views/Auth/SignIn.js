import React, { useState } from "react";
import { Snackbar } from "@material-ui/core";
import PropTypes from "prop-types";
import SignInForm from "../../components/Authentication/SignInForm";
import CloseIcon from "@material-ui/icons/Close";
// import auth styles
import IconButton from "@material-ui/core/IconButton";
import {
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";

//TODO: Setup forgot password page
//TODO: Error handling for authentication
export default function SignIn({ ...props }) {
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
      <CustomContainer maxWidth="xs">
        <TextStyle variant="h1" align="center">
          Sign in
        </TextStyle>
        <SignInForm openError={handleOpen} {...props} />
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

SignIn.propTypes = {
  props: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        next: PropTypes.object,
      }),
    }),
  }),
};

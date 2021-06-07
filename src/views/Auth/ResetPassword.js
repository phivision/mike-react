import { Snackbar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import ResetPasswordForm from "../../components/Authentication/ResetPasswordForm";
import PropTypes from "prop-types";
import {
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";

const ResetPassword = ({ ...props }) => {
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
      <CustomContainer maxWidth="sm">
        <TextStyle variant="h2">Reset Password</TextStyle>
        <ResetPasswordForm openError={handleOpen} {...props} />
      </CustomContainer>
    </>
  );
};

ResetPassword.propTypes = {
  props: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        next: PropTypes.object,
      }),
    }),
  }),
};

export default ResetPassword;

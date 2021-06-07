import React, { useState } from "react";
import PropTypes from "prop-types";
// import auth styles
import VerifyForm from "../../components/Authentication/VerifyForm";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Snackbar } from "@material-ui/core";
import {
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";

export default function Verify({ ...props }) {
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
        <TextStyle variant="h2">Verify your email</TextStyle>
        <VerifyForm openError={handleOpen} {...props} />
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

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Snackbar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const CustomSnackbar = (props) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (props.message === "") {
      setOpenSnackbar(false);
    } else {
      setOpenSnackbar(true);
    }
  }, [props.message]);

  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={6000}
      onClose={() => props.setMessage("")}
      message={props.message}
      action={
        <>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => props.setMessage("")}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
};

CustomSnackbar.propTypes = {
  message: PropTypes.string,
  setMessage: PropTypes.func,
};

export default CustomSnackbar;

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "../CustomButtons/Button";
import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";

export default function CustomDialog({
  open,
  title,
  text,
  onClose,
  onClickNo,
  onClickYes,
}) {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      scroll="body"
    >
      <GridContainer>
        <GridItem xs={9}>
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        </GridItem>
        <GridItem xs={3}>
          <DialogActions>
            <IconButton onClick={onClose} color="primary">
              <CloseIcon />
            </IconButton>
          </DialogActions>
        </GridItem>
      </GridContainer>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickNo} color="primary">
          No
        </Button>
        <Button onClick={onClickYes} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CustomDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  text: PropTypes.string,
  onClose: PropTypes.func,
  onClickNo: PropTypes.func,
  onClickYes: PropTypes.func,
};

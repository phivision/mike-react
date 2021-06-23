import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import VerticalTabs from "./VerticalTabs";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    minHeight: 350,
  },
}))(MuiDialogContent);

// const DialogActions = withStyles((theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//   },
// }))(MuiDialogActions);

export default function ChatPopUp({ openChat, handleCloseChat, userid, user }) {
  console.log("user", user, userid);
  return (
    <div>
      <Dialog
        onClose={handleCloseChat}
        aria-labelledby="customized-dialog-title"
        open={openChat}
        maxWidth="lg"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseChat}>
          chat
          {/* {user.FirstName} {user.LastName} */}
        </DialogTitle>
        <DialogContent dividers>
          <VerticalTabs
            // tabData={trainers}
            userid={userid}
            // setMessageInput={setMessageInput}
            // message={message}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

ChatPopUp.propTypes = {
  openChat: PropTypes.bool,
  handleCloseChat: PropTypes.func,
  userid: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

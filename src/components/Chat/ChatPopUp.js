import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import VerticalTabs from "./VerticalTabs";
import { API, graphqlOperation } from "aws-amplify";
import { getUserTrainers } from "../../graphql/message";

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

export default function ChatPopUp({
  openChat,
  handleCloseChat,
  userData,
  setAllMessageLength,
}) {
  console.log("user", userData);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState([]);
  // var chatRecord = [];
  // var TokenBalance = 0;

  const SubscriptionStudent = async () => {
    API.graphql(
      graphqlOperation(getUserTrainers, {
        id: userData.id,
      })
    )
      .then((d) => {
        const { Subscriptions, Users, ...p } = d.data.getUserProfile;
        setUser(p);
        setTrainers(Subscriptions.items);
        setStudents(Users.items);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    SubscriptionStudent();
  }, [userData.id]);
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
        </DialogTitle>
        <DialogContent dividers>
          <VerticalTabs
            setAllMessageLength={setAllMessageLength}
            trainers={trainers}
            students={students}
            user={user}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

ChatPopUp.propTypes = {
  openChat: PropTypes.bool,
  handleCloseChat: PropTypes.func,
  userData: PropTypes.any.isRequired,
  setAllMessageLength: PropTypes.any,
};

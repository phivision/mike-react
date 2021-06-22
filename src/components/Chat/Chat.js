import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
// import MessageLine from "./MessageLine";
import { API, graphqlOperation } from "aws-amplify";
// import { messagesByToUserID } from "../../graphql/message";
import { getUserTrainers } from "../../graphql/queries";
import VerticalTabs from "./VerticalTabs";
// import UserAvatar from "../../components/UserAvatar/UserAvatar";
// import {
//   GridItem,
//   GridTitleFlex,
// } from "../../components/StyledComponents/StyledComponents";

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
    minHeight: 300,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function Chat({ openChat, handleCloseChat, userid }) {
  // import initial message
  // const initialMessageState = {
  //   id: "",
  //   FromUserID: user.id,
  //   ToUserID: "",
  //   PostMessages: "",
  //   Status: "UNREAD",
  //   Type: "TEXT",
  // };
  const [trainers, setTrainers] = useState([]);
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState([]);
  const handleMessagehange = (event) => {
    setMessage({ ...message, [event.target.name]: event.target.value });
  };

  // let limit = 3;

  const SubscriptionTrainer = async () => {
    API.graphql(
      graphqlOperation(getUserTrainers, {
        id: userid,
      })
    )
      .then((d) => {
        console.log("d.data", d.data);
        const { Subscriptions, ...p } = d.data.getUserProfile;
        setUser(p);
        setTrainers(Subscriptions.items);
      })
      .catch((e) => console.log(e));
  };

  // const MessageQuery = async () => {
  //   API.graphql(
  //     graphqlOperation(messagesByToUserID, {
  //       FromUserID: user.id,
  //       ToUserID: profile.id,
  //       limit: limit,
  //     })
  //   )
  //     .then((d) => {
  //       setMessage(d.data.messagesByToUserID);
  //     })
  //     .catch(console.log);
  // };

  // useEffect(() => {
  //   MessageQuery();
  // }, [user.id, profile.id]);

  // console.log("message", message, MessageQuery);

  const addMessage = (Messages) => {
    setMessage([...message, { PostMessages: Messages }]);
  };

  useEffect(() => {
    SubscriptionTrainer();
  }, [userid]);

  // console.log("chart user", user, trainers);

  return (
    <div>
      <Dialog
        onClose={handleCloseChat}
        aria-labelledby="customized-dialog-title"
        open={openChat}
        maxWidth="lg"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseChat}>
          {user.FirstName} {user.LastName}
        </DialogTitle>
        <DialogContent dividers>
          <VerticalTabs tabData={trainers} user={user} />
          {/* {message.length <= 1
            ? ""
            : message.map((m, idx) => {
                return <MessageLine profile={profile} message={message} user={user} key={idx} />;
              })} */}
          {/* <MessageLine trainers={trainers} message={message} user={user} /> */}
        </DialogContent>
        <DialogActions>
          <TextField
            id="PostMessages"
            variant="outlined"
            multiline
            fullWidth
            name="PostMessages"
            value={message.PostMessages}
            onChange={handleMessagehange}
          />
          <Button
            autoFocus
            color="primary"
            onClick={() => {
              addMessage(message.PostMessages);
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Chat.propTypes = {
  openChat: PropTypes.bool,
  handleCloseChat: PropTypes.func,
  userid: PropTypes.string,
};

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
import { API, graphqlOperation } from "aws-amplify";
import {
  getMessageByToUserID,
  getUserTrainers,
  creatNewMessage,
} from "../../graphql/message";
import VerticalTabs from "./VerticalTabs";
import MessageLine from "./MessageLine";

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

const initialMessageForm = {
  id: "",
  ToUserID: "",
  FromUserID: "",
  PostMessages: "",
  createdAt: "",
};

export default function Chat({ openChat, handleCloseChat, userid }) {
  const [trainers, setTrainers] = useState([]);
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState([]);
  const [messageInput, setMessageInput] = useState(initialMessageForm);
  // let limit = 3;

  const SubscriptionTrainer = async () => {
    API.graphql(
      graphqlOperation(getUserTrainers, {
        id: userid,
      })
    )
      .then((d) => {
        const { Subscriptions, ...p } = d.data.getUserProfile;
        setUser(p);
        setTrainers(Subscriptions.items);
      })
      .catch((e) => console.log(e));
  };

  const MessageQuery = async () => {
    API.graphql(
      graphqlOperation(getMessageByToUserID, {
        ToUserID: userid,
      })
    )
      .then((d) => {
        // console.log("MessageQuery d.data", d.data);
        const UserMessages = d.data.messageByToUserID.items;
        setMessage(UserMessages);
      })
      .catch(console.log);
  };

  const createNewMessage = async () => {
    const result = await API.graphql(
      graphqlOperation(creatNewMessage, {
        input: {
          ToUserID: messageInput.ToUserID,
          FromUserID: userid,
          PostMessages: messageInput.PostMessages,
        },
      })
    );
    // updated message form with returned id and timestamp
    messageInput.id = result.data.creatNewMessage.id;
    messageInput.createdAt = result.data.creatNewMessage.createdAt;
  };

  console.log("message", message);

  // const addMessage = (Messages) => {
  //   setMessage([...message, { PostMessages: Messages }]);
  // };

  const handleMessagehange = (event) => {
    setMessageInput({
      ...messageInput,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    SubscriptionTrainer();
    MessageQuery();
  }, [userid]);

  // console.log("chart user", user, trainers);
  console.log("messageInput", messageInput);

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
          <VerticalTabs tabData={trainers} user={user}>
            {message.length < 1
              ? "No message"
              : message.map((m, idx) => {
                  return <MessageLine message={m} user={user} key={idx} />;
                })}
          </VerticalTabs>
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
              createNewMessage();
              // addMessage(message.PostMessages);
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
  userid: PropTypes.string.isRequired,
};

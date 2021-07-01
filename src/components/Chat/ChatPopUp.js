import React, { useState, useEffect, useCallback } from "react";
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
import { getUserTrainers, getMessageByToUserID } from "../../graphql/message";
import { mesaageSubscription } from "../../graphql/message";

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
  allMessageLength,
}) {
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState([]);
  const [createMsmSub, setCreateMsmSub] = useState([]);
  var contactList = [];
  var chatRecord = [];

  const handleMessage = useCallback(
    (UserMessages) => {
      setMessage(UserMessages);
    },
    [message]
  );

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
        return Subscriptions;
      })
      .catch((e) => console.log(e));
  };

  const MessageQuery = async () => {
    API.graphql(
      graphqlOperation(getMessageByToUserID, {
        ToUserID: userData.id,
      })
    )
      .then((d) => {
        const UserMessages = d.data.messageByToUserID.items;
        handleMessage(UserMessages);
      })
      .catch(console.log);
  };

  const messageSub = () => {
    let tempCreateSub = [];
    const createMsmSub = API.graphql({
      query: mesaageSubscription,
      variables: {
        ToUserID: userData.id,
      },
    }).subscribe({
      next: pushNewContent,
    });
    tempCreateSub.push(createMsmSub);
    setCreateMsmSub(tempCreateSub);
  };

  const unsubscribeAll = () => {
    createMsmSub.map((sub) => {
      sub.unsubscribe();
    });
  };
  const pushNewContent = useCallback(
    (d) => {
      chatRecord.push(d.value.data.onMessagesByToUserID);
      setMessage([...message, d.value.data.onMessagesByToUserID]);
    },
    [message]
  );

  const handleMessageLength = useCallback(
    (length) => {
      setAllMessageLength(length);
    },
    [allMessageLength]
  );

  useEffect(() => {
    if (userData.role == "student" || userData.role == "trainer") {
      SubscriptionStudent().then(() => {
        messageSub();
      });
      MessageQuery();
      return unsubscribeAll();
    } else {
      console.log("please login");
    }
  }, [userData.id]);

  // Generate contact lists based on user roles
  if (students.length < 1) {
    for (var t of trainers) {
      contactList.push({
        id: t.Trainer.id,
        name: t.Trainer.FirstName + " " + t.Trainer.LastName,
        UserImage: t.Trainer.UserImage,
        Email: t.Trainer.Email,
        Description: t.Trainer.Description,
      });
    }
  } else {
    for (var s of students) {
      contactList.push({
        id: s.User.id,
        name: s.User.FirstName + " " + s.User.LastName,
        UserImage: s.User.UserImage,
        Email: s.User.Email,
        Description: s.User.Description,
      });
    }
  }

  // generate local chat Record
  if (message.length > 0) {
    handleMessageLength(message.length);
    for (var m of message) {
      chatRecord.push({
        id: m.id,
        FromUserID: m.FromUserID,
        FromUser: m.FromUser,
        ToUserID: m.ToUserID,
        ToUser: m.ToUser,
        PostMessages: m.PostMessages,
        Status: m.Status,
        createdAt: m.createdAt,
        Type: m.Type,
      });
    }
  }

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
            user={user}
            contactList={contactList}
            chatRecord={chatRecord}
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
  allMessageLength: PropTypes.number,
};

import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { API, graphqlOperation } from "aws-amplify";
import { getMessageByToUserID, getUserTrainers } from "../../graphql/message";
import { createMessage } from "../../graphql/mutations";
import TextField from "@material-ui/core/TextField";
import MessageLine from "./MessageLine";
import {
  CustomButton,
  GridContainer,
  GridItem,
} from "../StyledComponents/StyledComponents";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 300,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs({ userid }) {
  const initialMessageForm = {
    id: "",
    ToUserID: "",
    FromUserID: userid,
    PostMessages: "",
    createdAt: "",
    src: "",
    name: "",
    send: false,
  };
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [trainers, setTrainers] = useState([]);
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState([]);
  const [messageInput, setMessageInput] = useState(initialMessageForm);
  const messageInputRef = useRef({});
  messageInputRef.current = messageInput;

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
        const UserMessages = d.data.messageByToUserID.items;
        setMessage(UserMessages);
      })
      .catch(console.log);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMessagehange = (event) => {
    setMessageInput({
      ...messageInput,
      [event.target.name]: event.target.value,
    });
  };

  const addMessage = (ToUserID, src, name) => {
    var myDate = new Date();
    return new Promise((resolve) => {
      setMessageInput({
        ...messageInput,
        ToUserID: ToUserID,
        createdAt: myDate,
        src: src,
        name: name,
        send: true,
      });
      console.log("message is add!", ToUserID, messageInput);
      resolve(messageInput);
    });
  };

  const createNewMessage = async (
    ToUser,
    FromUser,
    PostMessages,
    src,
    name
  ) => {
    if (ToUser && FromUser && PostMessages) {
      API.graphql(
        graphqlOperation(createMessage, {
          input: {
            ToUserID: ToUser,
            FromUserID: FromUser,
            PostMessages: PostMessages,
            Status: "UNRESPONDED",
            Type: "TEXT",
          },
        })
      );
    } else {
      console.log("message is empty!", ToUser, FromUser, PostMessages);
    }
    addMessage(ToUser, src, name);
    console.log("message is send!", ToUser, FromUser, PostMessages);
  };

  useEffect(() => {
    SubscriptionTrainer();
    MessageQuery();
  }, [userid]);

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {trainers.map((trainer, idx) => {
          return (
            <Tab
              label={trainer.Trainer.FirstName + " " + trainer.Trainer.LastName}
              {...a11yProps(idx)}
              key={"TabLabel" + idx}
              onClick={() => {
                setMessageInput({
                  ...messageInput,
                  ToUserID: trainer.Trainer.id,
                  PostMessages: "",
                });
              }}
            />
          );
        })}
      </Tabs>
      {trainers.map((trainer, idx) => {
        var trainerId = trainer.Trainer.id;
        return (
          <TabPanel
            value={value}
            index={idx}
            key={"TabPanel" + idx}
            style={{ width: 500 }}
          >
            <div style={{ height: 150, overflowY: "auto" }}>
              {message.length < 1
                ? "No message" && (
                    <MessageLine
                      message=""
                      user={user}
                      key={idx}
                      messageInput={messageInput}
                      trainerId={trainerId}
                    />
                  )
                : message.map((m, idx) => {
                    if (trainerId === m.FromUserID) {
                      return (
                        <MessageLine
                          message={m}
                          user={user}
                          key={idx}
                          messageInput={messageInput}
                          trainerId={trainerId}
                        />
                      );
                    }
                  })}
            </div>
            <GridContainer
              style={{
                position: "absolute",
                height: "100px",
                bottom: 0,
                width: 450,
                borderTop: "1px solid",
              }}
            >
              <GridItem xs={10}>
                <TextField
                  id="PostMessages"
                  variant="outlined"
                  multiline
                  fullWidth
                  name="PostMessages"
                  // value={message.PostMessages}
                  onChange={handleMessagehange}
                />
              </GridItem>
              <GridItem xs={2}>
                <CustomButton
                  autoFocus
                  color="primary"
                  onClick={() => {
                    createNewMessage(
                      trainerId,
                      messageInput.FromUserID,
                      messageInput.PostMessages,
                      user.UserImage,
                      user.FirstName + " " + user.LastName
                    );
                  }}
                >
                  Send
                </CustomButton>
              </GridItem>
            </GridContainer>
          </TabPanel>
        );
      })}
    </div>
  );
}

VerticalTabs.propTypes = {
  userid: PropTypes.string.isRequired,
};

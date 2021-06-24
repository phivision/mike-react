import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
// import Typography from "@material-ui/core/Typography";
// import Box from "@material-ui/core/Box";
import { API, graphqlOperation } from "aws-amplify";
import {
  getMessageByToUserID,
  getUserTrainers,
  creatNewMessage,
} from "../../graphql/message";
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
        // const trainerLength = Subscriptions.items.length;
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMessagehange = (event) => {
    setMessageInput({
      ...messageInput,
      [event.target.name]: event.target.value,
    });
  };

  const addMessage = (ToUserID, FromUserID, PostMessages, src, name) => {
    console.log("addMessage", ToUserID, FromUserID, PostMessages);
    var myDate = new Date();
    // setMessageInput([
    //   ...messageInput,
    //   {
    //     ToUserID: ToUserID,
    //     FromUserID: FromUserID,
    //     PostMessages: PostMessages,
    //     createdAt: myDate.toLocaleTimeString(),
    //     src: src,
    //     name: name,
    //   },
    // ]);
    const p = new Promise((resolve) => {
      setMessageInput({
        ToUserID: ToUserID,
        FromUserID: FromUserID,
        PostMessages: PostMessages,
        createdAt: myDate.toLocaleTimeString(),
        src: src,
        name: name,
      });
      resolve("setMessageInput");
    }).then(createNewMessage());
    console.log(p);
    // setEditSection(() => {
    //   editSection.push(true);
    //   return [...editSection];
    // });
  };

  const createNewMessage = async () => {
    const currentInput = messageInputRef.current;
    console.log("currentInput", currentInput);
    if (
      currentInput.ToUserID &&
      currentInput.FromUserID &&
      currentInput.PostMessages
    ) {
      const result = await API.graphql(
        graphqlOperation(creatNewMessage, {
          input: {
            ToUserID: currentInput.ToUserID,
            FromUserID: currentInput.FromUserID,
            PostMessages: currentInput.PostMessages,
          },
        })
      );
      // updated message form with returned id and timestamp
      messageInputRef.current.id = result.data.creatNewMessage.id;
      messageInputRef.current.createdAt = result.data.creatNewMessage.createdAt;
    } else {
      console.log("messageInput is empty!", currentInput);
    }
  };

  useEffect(() => {
    SubscriptionTrainer();
    MessageQuery();
  }, [userid]);

  console.log("messageInput", messageInput, message);

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
          // setMessageInput({
          //   ...messageInput,
          //   ["FromUserID"]: data.Trainer.id,
          // });
          // console.log("trainer", trainer);
          return (
            <Tab
              label={trainer.Trainer.FirstName + " " + trainer.Trainer.LastName}
              {...a11yProps(idx)}
              key={"TabLabel" + idx}
              onClick={() => {
                // setMessageInput({
                //   ...messageInput,
                //   [event.target.name]: event.target.value,
                // });
                // addMessage(message.PostMessages);
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
                ? "No message"
                : message.map((m, idx) => {
                    if (trainerId === m.FromUserID) {
                      return (
                        <MessageLine
                          message={m}
                          user={user}
                          key={idx}
                          messageInput={messageInput}
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
                    // createNewMessage();
                    addMessage(
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

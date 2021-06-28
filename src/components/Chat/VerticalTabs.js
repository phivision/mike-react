import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { API, graphqlOperation } from "aws-amplify";
import { getMessageByToUserID } from "../../graphql/message";
import { createMessage } from "../../graphql/mutations";
import TextField from "@material-ui/core/TextField";
import Badge from "@material-ui/core/Badge";
import MessageLine from "./MessageLine";
import {
  CustomButton,
  GridContainer,
  GridItem,
} from "../StyledComponents/StyledComponents";
import MessageIcon from "@material-ui/icons/Message";

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

export default function VerticalTabs({
  setAllMessageLength,
  trainers,
  students,
  user,
}) {
  const initialMessageForm = {
    id: "",
    ToUserID: "",
    FromUserID: user.id,
    PostMessages: "",
    createdAt: "",
    src: "",
    name: "",
    send: false,
  };
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  // const [trainers, setTrainers] = useState([]);
  // const [user, setUser] = useState([]);
  const [message, setMessage] = useState([]);
  const [messageInput, setMessageInput] = useState(initialMessageForm);
  const messageInputRef = useRef({});
  messageInputRef.current = messageInput;
  const [post, setPost] = useState("");
  const [msmTrainer, setMsmTrainer] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  var chatRecord = [];
  var contactList = [];
  var records = [];
  // Generate contact lists based on user roles
  if (students.length < 1) {
    console.log("students == []");
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
    console.log("trainers == []");
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

  // const [fromUsers, setFromUsers] = useState([]);

  // const SubscriptionTrainer = async () => {
  //   API.graphql(
  //     graphqlOperation(getUserTrainers, {
  //       id: userData.id,
  //     })
  //   )
  //     .then((d) => {
  //       const { Subscriptions, ...p } = d.data.getUserProfile;
  //       setUser(p);
  //       setTrainers(Subscriptions.items);
  //     })
  //     .catch((e) => console.log(e));
  // };

  const MessageQuery = async () => {
    API.graphql(
      graphqlOperation(getMessageByToUserID, {
        ToUserID: user.id,
      })
    )
      .then((d) => {
        const UserMessages = d.data.messageByToUserID.items;
        setMessage(UserMessages);
        // console.log("UserMessages", UserMessages);
      })
      .catch(console.log);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePostchange = (event) => {
    setPost(event.target.value);
  };

  const addMessage = (ToUserID, src, name) => {
    var myDate = new Date();
    // return new Promise((resolve) => {
    setMessageInput({
      ...messageInput,
      ToUserID: ToUserID,
      createdAt: myDate,
      src: src,
      name: name,
      send: true,
    });
    console.log("message is add!", ToUserID, messageInput);
    //   resolve(messageInput);
    // });
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

  if (message) {
    setAllMessageLength(message.length);
    // generate local chat Record
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

  // if (!user.id) {
  //   alert("please login!");
  // }

  // let fromUsers = [];
  // let arrId = [];

  // for (const item of message) {
  //   if (arrId.indexOf(item.FromUserID) === -1) {
  //     arrId.push(item.FromUserID);
  //     fromUsers.push(item.FromUser);
  //   }
  // }

  // console.log("list is ", fromUsers, arrId);
  // console.log("canshu", contactList, trainers, students);

  const addToChatRecord = (contact, user, PostMessages) => {
    var currentTime = new Date();
    chatRecord.push({
      id: "",
      FromUserID: user.id,
      FromUser: user,
      ToUserID: contact.id,
      ToUser: contact,
      PostMessages: PostMessages,
      Status: "SEND",
      createdAt: currentTime,
      Type: "TEXT",
    });

    setMsmTrainer([
      ...msmTrainer,
      {
        id: "",
        FromUserID: user.id,
        FromUser: user,
        ToUserID: contact.id,
        ToUser: contact,
        PostMessages: PostMessages,
        Status: "SEND",
        createdAt: currentTime,
        Type: "TEXT",
      },
    ]);
    setPost("");
    console.log("add new record", chatRecord, message);
    return chatRecord;
  };

  // console.log("chatRecord message", chatRecord, message);
  const filterChatList = (contactId, chatRecord) => {
    let Trainer = chatRecord.filter((value) => {
      return value.FromUserID == contactId;
    });
    return Trainer;
  };

  useEffect(() => {
    if (user.UserRole == "student" || user.UserRole == "trainer") {
      MessageQuery();
      if (chatRecord.length > 0 && contactList.length > 0) {
        setMsmTrainer(filterChatList(contactList[0].id, chatRecord));
        setSelectedUser(contactList[0].id);
      }
    } else {
      console.log("please login");
    }
  }, [user.id]);

  console.log("msmTrainer", msmTrainer);

  useEffect(() => {
    if (chatRecord.length > 0 && selectedUser !== "") {
      setMsmTrainer(filterChatList(selectedUser, chatRecord));
      records = filterChatList(selectedUser, chatRecord);
    }
  }, [selectedUser]);

  console.log("records", selectedUser, records, chatRecord);

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
        {contactList.map((contact, idx) => {
          records = filterChatList(contact.id, chatRecord);
          return (
            <Tab
              label={contact.name}
              {...a11yProps(idx)}
              key={"TabLabel" + idx}
              onClick={() => {
                setMsmTrainer(filterChatList(contact.id, chatRecord));
                setSelectedUser(contact.id);
                // setMessageInput({
                //   ...messageInput,
                //   ToUserID: contact.id,
                //   PostMessages: "",
                // });
                setPost("");
              }}
              icon={
                <Badge badgeContent={records.length} color="primary">
                  <MessageIcon />
                </Badge>
              }
            />
          );
        })}
      </Tabs>
      {contactList.map((contact, idx) => {
        var trainerId = contact.id;
        records = filterChatList(contact.id, chatRecord);
        // console.log("msmTrainer", msmTrainer, contact);
        return (
          <TabPanel
            value={value}
            index={idx}
            key={"TabPanel" + idx}
            style={{ width: 500 }}
          >
            <div style={{ height: 150, overflowY: "auto" }}>
              {
                msmTrainer.length < 0 ? (
                  "No message"
                ) : (
                  <MessageLine
                    message={m}
                    user={user}
                    key={idx}
                    messageInput={messageInput}
                    contact={contact.id}
                    chatRecord={msmTrainer}
                  />
                )
                // : msmTrainer.map((m, idx) => {
                //     // : message.map((m, idx) => {
                //     //     if (trainerId === m.FromUserID) {
                //     // console.log("msmTrainer, m", msmTrainer, m);
                //     return (
                //       <MessageLine
                //         message={m}
                //         user={user}
                //         key={idx}
                //         messageInput={messageInput}
                //         trainerId={trainerId}
                //         chatRecord={chatRecord}
                //       />
                //     );
                //     // }
                //   })
              }
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
                  value={post}
                  onChange={handlePostchange}
                />
              </GridItem>
              <GridItem xs={2}>
                <CustomButton
                  autoFocus
                  color="primary"
                  onClick={() => {
                    createNewMessage(
                      trainerId,
                      user.id,
                      post,
                      user.UserImage,
                      user.FirstName + " " + user.LastName
                    );
                    addToChatRecord(contact, user, post);
                    setPost("");
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
  setAllMessageLength: PropTypes.any.isRequired,
  trainers: PropTypes.any.isRequired,
  students: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired,
};

import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { API, graphqlOperation } from "aws-amplify";
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
import { updateMessage } from "../../graphql/mutations";

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

export default function VerticalTabs({ user, contactList, chatRecord }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [post, setPost] = useState("");
  const [messageIds, setMessageIds] = useState([]);
  const messageIdsRef = useRef([]);
  messageIdsRef.current = messageIds;
  var records = [];
  var receList = [];

  const handleChange = useCallback(
    (event, newValue) => {
      setValue(newValue);
    },
    [value]
  );

  const handlePostchange = useCallback(
    (event) => {
      setPost(event.target.value);
    },
    [post]
  );

  const updateMsmStatus = async () => {
    var Ids = messageIdsRef.current;
    if (Ids.length > 0) {
      Ids.map((Id) => {
        API.graphql(
          graphqlOperation(updateMessage, {
            input: {
              id: Id,
              Status: "RESPONDED",
            },
          })
        );
      });
    } else {
      console.log("messageIds is empty!", messageIdsRef.current);
    }
  };

  const createNewMessage = async (ToUser, FromUser, PostMessages) => {
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
      updateMsmStatus();
    } else {
      console.log("message is empty!", ToUser, FromUser, PostMessages);
    }
  };

  const handleMessageIds = useCallback(
    (recelist) => {
      var tempIds = [];
      if (recelist.length > 0) {
        for (var list of recelist) {
          tempIds.push(list.id);
        }
        setMessageIds(tempIds);
      }
    },
    [messageIds]
  );

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
    setPost("");
    return chatRecord;
  };

  const filterChatList = (contactId, chatRecord) => {
    let Trainer = chatRecord.filter((value) => {
      return value.FromUserID == contactId || value.ToUserID == contactId;
    });
    return Trainer;
  };

  useEffect(() => {
    if (chatRecord.length > 0 && contactList.length > 0) {
      var templist = [];
      records = filterChatList(contactList[0].id, chatRecord);
      for (var record of records) {
        templist.push(record.id);
      }
      setMessageIds(templist);
    }
  }, [user.id]);

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
          receList = records.filter((l) => {
            return l.Status == "UNRESPONDED";
          });
          return (
            <Tab
              label={contact.name}
              {...a11yProps(idx)}
              key={"TabLabel" + idx}
              onClick={() => {
                handleMessageIds(receList);
                setPost("");
              }}
              icon={
                <Badge badgeContent={receList.length} color="primary">
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
        return (
          <TabPanel
            value={value}
            index={idx}
            key={"TabPanel" + idx}
            style={{ width: 500 }}
          >
            <div style={{ height: 150, overflowY: "auto" }}>
              {records.length < 0 ? (
                "No message"
              ) : (
                <MessageLine user={user} records={records} />
              )}
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
                    createNewMessage(trainerId, user.id, post);
                    chatRecord = addToChatRecord(contact, user, post);
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
  contactList: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired,
  chatRecord: PropTypes.any.isRequired,
};

import React from "react";
import PropTypes from "prop-types";
import {
  GridContainer,
  GridItem,
  TextStyle,
  TextWithColor,
} from "../StyledComponents/StyledComponents";
import UserAvatar from "../../components/UserAvatar/UserAvatar";

const MessageRecord = (props) => {
  const { src, name, time, text } = props;
  return (
    <>
      <GridContainer>
        <GridItem xs={2}>
          <UserAvatar src={src} width="50px" />
        </GridItem>
        <GridItem xs={3}>
          <TextStyle variant="body2">{name}</TextStyle>
        </GridItem>
        <GridItem xs={3}>
          <TextStyle variant="body2">
            {new Date(time).toLocaleTimeString()}
          </TextStyle>
        </GridItem>
      </GridContainer>
      <TextWithColor align="left">{text}</TextWithColor>
    </>
  );
};

MessageRecord.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  time: PropTypes.any,
  text: PropTypes.string,
};

const MessageLine = ({ user, contact, chatRecord }) => {
  console.log("MessageLine ", contact, chatRecord);
  if (chatRecord.length > 0) {
    return (
      <div>
        {chatRecord.map((record, idx) => {
          // console.log("record", record);
          return (
            <div key={"record" + idx}>
              {record.Status == "SEND" ? (
                <MessageRecord
                  src={user.UserImage}
                  name={user.FirstName + " " + user.LastName}
                  time={record.createdAt}
                  text={record.PostMessages}
                />
              ) : (
                <MessageRecord
                  src={record.FromUser.UserImage}
                  // name={record.FromUser.FirstName + " " + record.FromUser.LastName}
                  name={
                    record.FromUser.FirstName + " " + record.FromUser.LastName
                  }
                  time={record.createdAt}
                  text={record.PostMessages}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  } else {
    return <>Please select contact!</>;
  }
  /* {message ? (
        message.Status == "SEND" ? (
          <MessageRecord
            src={user.UserImage}
            name={user.FirstName + " " + user.LastName}
            time={message.createdAt}
            text={message.PostMessages}
          />
        ) : (
          <MessageRecord
            src={message.FromUser.UserImage}
            name={message.FromUser.FirstName + " " + message.FromUser.LastName}
            time={message.createdAt}
            text={message.PostMessages}
            style={{ background: "" }}
          />
        )
      ) : (
        ""
      )} */
  /* </div>
  ); */
};

MessageLine.propTypes = {
  contact: PropTypes.any,
  user: PropTypes.object,
  messageInput: PropTypes.object,
  chatRecord: PropTypes.any,
};

export default MessageLine;

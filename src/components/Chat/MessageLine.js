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
  // var curTime = new Date(time).getTime
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
  time: PropTypes.string,
  text: PropTypes.string,
};

const MessageLine = ({ message, user, messageInput }) => {
  console.log("MessageLine", message, messageInput);
  return (
    <div>
      <MessageRecord
        src={message.FromUser.UserImage}
        name={message.FromUser.FirstName + " " + message.FromUser.LastName}
        time={message.createdAt}
        text={message.PostMessages}
        style={{ background: "" }}
      />
      {messageInput.ToUserID ? (
        <MessageRecord
          src={user.UserImage}
          name={user.FirstName + " " + user.LastName}
          time={messageInput.createdAt}
          text={messageInput.PostMessages}
        />
      ) : (
        ""
      )}
    </div>
  );
};

MessageLine.propTypes = {
  message: PropTypes.string,
  profile: PropTypes.object,
  user: PropTypes.object,
  messageInput: PropTypes.object,
};

export default MessageLine;

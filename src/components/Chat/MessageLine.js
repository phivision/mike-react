import React from "react";
import PropTypes from "prop-types";
import {
  GridContainer,
  GridItem,
  TextStyle,
} from "../StyledComponents/StyledComponents";
import UserAvatar from "../../components/UserAvatar/UserAvatar";

const MessageRecord = (props) => {
  const { src, name, time, text } = props;
  // var curTime = new Date(time).getTime
  return (
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
      <GridItem xs={12}>{text}</GridItem>
    </GridContainer>
  );
};

MessageRecord.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  time: PropTypes.string,
  text: PropTypes.string,
};

const MessageLine = ({ message, user }) => {
  console.log("MessageLine", message, user);
  return (
    <div>
      <MessageRecord
        src={message.FromUser.UserImage}
        name={message.FromUser.FirstName + " " + message.FromUser.LastName}
        time={message.createdAt}
        text={message.PostMessages}
      />
      {/* <MessageRecord
        src={message.ToUser.UserImage}
        name={message.ToUser.FirstName + " " + message.ToUser.LastName}
        time={message.createdAt}
        text={message.PostMessages}
      /> */}
    </div>
  );
};

MessageLine.propTypes = {
  message: PropTypes.string,
  profile: PropTypes.object,
  user: PropTypes.object,
};

export default MessageLine;

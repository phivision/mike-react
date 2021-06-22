import React from "react";
import PropTypes from "prop-types";
import {
  GridContainer,
  GridItem,
  TextStyle,
} from "../StyledComponents/StyledComponents";
import UserAvatar from "../../components/UserAvatar/UserAvatar";

const MessageLine = ({ profile, message, user }) => {
  var myDate = new Date();
  console.log("profile", profile, user);
  return (
    <div>
      <GridContainer>
        <GridItem xs={2}>
          <UserAvatar src={profile.UserImage} width="50px" />
        </GridItem>
        <GridItem xs={3}>
          <TextStyle variant="body2">
            {profile.FirstName + " " + profile.LastName}
          </TextStyle>
        </GridItem>
        <GridItem xs={3}>
          <TextStyle variant="body2">{myDate.toLocaleTimeString()}</TextStyle>
        </GridItem>
        <GridItem xs={12}>{message.PostMessages}</GridItem>
      </GridContainer>
    </div>
  );
};

MessageLine.propTypes = {
  message: PropTypes.string,
  profile: PropTypes.object,
  user: PropTypes.object,
};

export default MessageLine;

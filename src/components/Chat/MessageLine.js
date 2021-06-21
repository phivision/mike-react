import React from "react";
import PropTypes from "prop-types";
import {
  GridContainer,
  GridItem,
  TextStyle,
} from "../StyledComponents/StyledComponents";
import UserAvatar from "../../components/UserAvatar/UserAvatar";

const MessageLine = ({ profile, text }) => {
  var myDate = new Date();
  console.log("profile", profile);
  return (
    <div>
      <GridContainer>
        <GridItem xs={2}>
          <UserAvatar src={profile.UserImage} width="50px" />
        </GridItem>
        <GridItem xs={3}>
          <TextStyle variant="body1">
            {profile.FirstName + " " + profile.LastName}
          </TextStyle>
        </GridItem>
        <GridItem xs={4}>
          <TextStyle variant="body1">{myDate.toLocaleDateString()}</TextStyle>
        </GridItem>
        <GridItem xs={12}>{text}</GridItem>
      </GridContainer>
    </div>
  );
};

MessageLine.propTypes = {
  text: PropTypes.string,
  profile: PropTypes.object,
};

export default MessageLine;

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

const MessageLine = ({ user, records }) => {
  if (records.length > 0) {
    return (
      <div>
        {records.map((record, idx) => {
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
    return <></>;
  }
};

MessageLine.propTypes = {
  user: PropTypes.object,
  records: PropTypes.array,
};

export default MessageLine;

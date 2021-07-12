import React, { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import PropTypes from "prop-types";
import avatar from "assets/faces/blank.png";
import { CardIcon } from "../StyledComponents/StyledComponents";

const UserAvatar = ({ UserImage: UserImage, ...p }) => {
  const [UserURL, setURL] = useState("");

  useEffect(() => {
    if (UserImage) {
      Storage.get(UserImage).then((d) => {
        setURL(d);
      });
    } else {
      setURL(avatar);
    }
  }, [UserImage]);

  return (
    <div style={{ maxWidth: "150px" }}>
      <CardIcon {...p} alt="Profile Picture" src={UserURL} />
    </div>
  );
};

UserAvatar.propTypes = {
  UserImage: PropTypes.string,
};

export default UserAvatar;

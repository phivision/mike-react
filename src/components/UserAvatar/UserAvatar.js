import React, { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import { Avatar } from "@material-ui/core";
import PropTypes from "prop-types";
import avatar from "assets/img/faces/marc.jpg";

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

  return <Avatar {...p} alt="Profile Picture" src={UserURL} />;
};

UserAvatar.propTypes = {
  UserImage: PropTypes.string,
};

export default UserAvatar;

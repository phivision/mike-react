import React, { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import { Avatar } from "@material-ui/core";
import PropTypes from "prop-types";

const TrainerAvatar = ({ UserImage: UserImage, ...p }) => {
  const [UserURL, setURL] = useState("");

  useEffect(() => {
    Storage.get(UserImage).then((d) => {
      setURL(d);
    });
  }, [UserImage]);

  return <Avatar {...p} alt="Profile Picture" src={UserURL} />;
};

TrainerAvatar.propTypes = {
  UserImage: PropTypes.string.isRequired,
};

export default TrainerAvatar;

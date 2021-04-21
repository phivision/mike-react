import React from "react";
import Button from "components/CustomButtons/Button.js";
import PropTypes from "prop-types";

export default function Settings(props) {
  return (
    <div>
      <Button color="primary">Change Password</Button>
      <div>{"User ID:" + props.user}</div>
    </div>
  );
}

Settings.propTypes = {
  user: PropTypes.string,
};

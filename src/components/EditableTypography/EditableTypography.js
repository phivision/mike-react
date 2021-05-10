import React from "react";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";

const EditableTypography = ({
  text: text,
  edit: edit,
  onChange: onChange,
  variant: variant,
  label: label,
  ...p
}) => {
  return edit ? (
    <TextField
      multiline
      value={text}
      onChange={onChange}
      label={label}
      variant="outlined"
      {...p}
    />
  ) : (
    <Typography variant={variant} {...p}>
      {text}
    </Typography>
  );
};

EditableTypography.propTypes = {
  text: PropTypes.string,
  edit: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
};

export default EditableTypography;

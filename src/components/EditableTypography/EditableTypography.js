import React from "react";
import PropTypes from "prop-types";
import {
  InputField,
  TextStyle,
} from "../../components/StyledComponets/StyledComponets";

const EditableTypography = ({
  text: text,
  edit: edit,
  onChange: onChange,
  variant: variant,
  label: label,
  showLabel: showLabel,
  ...p
}) => {
  showLabel ? false : showLabel;
  return edit ? (
    <InputField
      value={text}
      onChange={onChange}
      label={label}
      id={"Input" + text}
      {...p}
    />
  ) : (
    <TextStyle variant={variant} {...p}>
      {showLabel ? `${label}: ${text}` : text}
    </TextStyle>
  );
};

EditableTypography.propTypes = {
  text: PropTypes.string,
  edit: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
  showLabel: PropTypes.bool,
};

export default EditableTypography;

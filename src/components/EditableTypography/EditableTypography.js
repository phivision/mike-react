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
  ...p
}) => {
  return edit ? (
    <InputField value={text} onChange={onChange} label={label} {...p} />
  ) : (
    <TextStyle variant={variant} {...p}>
      {text}
    </TextStyle>
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

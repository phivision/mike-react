import React from "react";
import PropTypes from "prop-types";
import VerifyForm from "../../components/Authentication/VerifyForm";
import {
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";

export default function Verify({ ...props }) {
  return (
    <CustomContainer maxWidth="sm">
      <TextStyle variant="h2">Verify your email</TextStyle>
      <VerifyForm {...props} />
    </CustomContainer>
  );
}

Verify.propTypes = {
  props: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        next: PropTypes.object,
      }),
    }),
  }),
};

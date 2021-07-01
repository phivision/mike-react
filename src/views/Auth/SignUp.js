import React from "react";
import PropTypes from "prop-types";
import SignUpForm from "../../components/Authentication/SignUpForm";
import {
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";

export default function SignUp({ ...props }) {
  return (
    <CustomContainer maxWidth="sm">
      <TextStyle variant="h2">Sign up</TextStyle>
      <SignUpForm {...props} />
    </CustomContainer>
  );
}

SignUp.propTypes = {
  props: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.shape({
        role: PropTypes.string,
      }),
    }),
    location: PropTypes.shape({
      state: PropTypes.shape({
        next: PropTypes.object,
      }),
    }),
  }),
};

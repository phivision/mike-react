import React from "react";
import PropTypes from "prop-types";
import SignInForm from "../../components/Authentication/SignInForm";
import {
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";

export default function SignIn({ ...props }) {
  return (
    <CustomContainer maxWidth="sm">
      <TextStyle variant="h2" align="center">
        Sign in
      </TextStyle>
      <SignInForm {...props} />
    </CustomContainer>
  );
}

SignIn.propTypes = {
  props: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        next: PropTypes.object,
      }),
    }),
  }),
};

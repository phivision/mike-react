import React from "react";
import ResetPasswordForm from "../../components/Authentication/ResetPasswordForm";
import PropTypes from "prop-types";
import {
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";

const ResetPassword = ({ ...props }) => {
  return (
    <CustomContainer maxWidth="sm">
      <TextStyle variant="h2">Reset Password</TextStyle>
      <ResetPasswordForm {...props} />
    </CustomContainer>
  );
};

ResetPassword.propTypes = {
  props: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        next: PropTypes.object,
      }),
    }),
  }),
};

export default ResetPassword;

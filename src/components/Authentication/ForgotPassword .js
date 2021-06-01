import React from "react";
import { TextField } from "@material-ui/core";
import { Auth } from "aws-amplify";
import PropTypes from "prop-types";
import {
  TextStyle,
  CustomButton,
  DialogBody,
  DividerLine,
} from "../StyledComponets/StyledComponets";

export default function ForgotPassword(props) {
  const [showVerify, setShowVerify] = React.useState(false);
  const [verifyCode, setVerifyCode] = React.useState("");
  const { state, handleChange, handleModalClose } = props;

  const handleShowVerify = () => {
    setShowVerify(true);
  };

  const handleVerifyCode = (e) => {
    setVerifyCode(e.target.value);
  };

  const handleForgotPassword = (username) => {
    // Send confirmation code to user's email
    Auth.forgotPassword(username)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  const handleForgotPasswordSubmit = (username, code, new_password) => {
    // Collect confirmation code and new password, then
    Auth.forgotPasswordSubmit(username, code, new_password)
      .then((data) => console.log("Successful update password", data))
      .catch((err) => console.log(err));
  };

  return (
    <DialogBody>
      <TextStyle id="form-dialog-title" variant="subtitle1">
        Reset Password
      </TextStyle>
      <TextStyle variant="body1">
        Please enter the email account to reset your password:
      </TextStyle>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email-reset-password"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={state.email}
        onChange={(e) => handleChange(e)}
      />
      <CustomButton
        onClick={() => {
          handleForgotPassword(state.email);
          handleShowVerify();
        }}
        fullWidth
      >
        Send Email
      </CustomButton>
      {showVerify ? (
        <div>
          <DividerLine />
          <TextField
            name="verification-code"
            label="verification code"
            variant="outlined"
            required
            id="reset-password-verify-code"
            fullWidth
            autoFocus
            placeholder="Input code"
            margin="normal"
            value={verifyCode}
            onChange={(e) => handleVerifyCode(e)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            name="password"
            label="New Password"
            type="password"
            id="change-new-password"
            placeholder="Input new password"
            inputProps={{
              autoComplete: "new-password",
              form: {
                autoComplete: "off",
              },
            }}
            onChange={(e) => handleChange(e)}
            fullWidth
          />
          <CustomButton
            onClick={() => {
              handleForgotPasswordSubmit(
                state.email,
                verifyCode,
                state.password
              );
              handleShowVerify();
              handleModalClose();
            }}
            fullWidth
          >
            Verify
          </CustomButton>
        </div>
      ) : (
        ""
      )}
    </DialogBody>
  );
}

ForgotPassword.propTypes = {
  state: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
};

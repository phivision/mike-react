import React, { useEffect } from "react";
import { TextField } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { TextStyle, CustomButton } from "../StyledComponents/StyledComponents";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const ResetPasswordForm = ({ ...props }) => {
  const [showVerify, setShowVerify] = React.useState(false);
  const [verifyCode, setVerifyCode] = React.useState("");
  const history = useHistory();
  const [state, setState] = React.useState({
    email: "",
    password: "",
    remember: false,
  });

  useEffect(() => {
    if (localStorage.getItem("remember")) {
      setState({
        email: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
        remember: true,
      });
    }
  }, []);

  const handleVerifyCode = (e) => {
    setVerifyCode(e.target.value);
  };

  const handleForgotPassword = () => {
    // Send confirmation code to user's email
    Auth.forgotPassword(state.email)
      .then((data) => {
        console.log(data);
        setShowVerify(true);
      })
      .catch((err) => {
        props.openError(err.message);
      });
  };

  const handleForgotPasswordSubmit = () => {
    // Collect confirmation code and new password, then
    Auth.forgotPasswordSubmit(state.email, verifyCode, state.password)
      .then(() => {
        if (state.remember) {
          localStorage.setItem("password", state.password);
        }
        Auth.signIn(state.email, state.password).then(() => {
          if (props.location.state !== undefined) {
            if (props.location.state.next !== undefined) {
              history.push(props.location.state.next);
            }
          }
          history.push("/user/");
        });
      })
      .catch((err) => {
        props.openError(err.message);
      });
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  return (
    <>
      {showVerify ? (
        <div>
          <TextStyle variant="body1">
            The verification code was sent to your email. Please enter it below
            to change your password.
          </TextStyle>
          <TextField
            name="verification-code"
            label="Verification Code"
            variant="outlined"
            required
            id="reset-password-verify-code"
            fullWidth
            autoFocus
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
            inputProps={{
              autoComplete: "new-password",
              form: {
                autoComplete: "off",
              },
            }}
            onChange={handleChange}
            fullWidth
          />
          <CustomButton
            onClick={handleForgotPasswordSubmit}
            variant="contained"
            fullWidth
          >
            Verify
          </CustomButton>
        </div>
      ) : (
        <>
          <TextStyle variant="body1">
            Please enter your email address to reset your password:
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
            onChange={handleChange}
          />
          <CustomButton
            variant="contained"
            onClick={handleForgotPassword}
            fullWidth
          >
            Send Email
          </CustomButton>
        </>
      )}
    </>
  );
};

ResetPasswordForm.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      next: PropTypes.object,
    }),
  }),
  openError: PropTypes.func,
};

export default ResetPasswordForm;

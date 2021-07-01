import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Auth } from "aws-amplify";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { CustomButton } from "../StyledComponents/StyledComponents";
import CustomSnackbar from "../CustomSnackbar/CustomSnackbar";
// import auth styles

export default function VerifyForm({ ...props }) {
  const history = useHistory();

  const [verify, setVerify] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    setVerify(e.target.value);
  };

  const stripeOnboarding = async (cognitoID) => {
    if (props.location.state.role === "trainer") {
      const myInit = {
        headers: {}, // AWS-IAM authorization if using empty headers
        body: {
          email: props.location.state.username,
          id: cognitoID,
        },
        response: true,
      };
      await API.post("stripeAPI", "/stripe/api/trainer/create", myInit);
    } else {
      const myInit = {
        headers: {}, // AWS-IAM authorization if using empty headers
        body: {
          email: props.location.state.username,
          id: cognitoID,
        },
        response: true,
      };

      await API.post("stripeAPI", "/stripe/api/user/create", myInit);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      Auth.confirmSignUp(props.location.state.username, verify).then(() => {
        Auth.signIn(
          props.location.state.username,
          props.location.state.password
        ).then((user) => {
          stripeOnboarding(user.username).then(() => {
            if (props.location.state !== undefined) {
              if (props.location.state.next !== undefined) {
                history.push(props.location.state.next);
              }
            }
            history.push("/user/");
          });
        });
      });
    } catch (error) {
      setSnackbarMessage(error.message);
    }
  }

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)} noValidate>
        <Grid container spacing={2}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoFocus
            onChange={handleChange}
          />
        </Grid>
        <CustomButton type="submit" fullWidth variant="contained">
          Verify
        </CustomButton>
      </form>
      <CustomSnackbar
        message={snackbarMessage}
        setMessage={setSnackbarMessage}
      />
    </>
  );
}

VerifyForm.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      username: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      next: PropTypes.object,
    }),
  }),
};

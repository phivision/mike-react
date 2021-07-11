import { CustomButton, InputField } from "../StyledComponents/StyledComponents";
import React, { useState } from "react";
import { API } from "aws-amplify";
import CustomSnackbar from "../CustomSnackbar/CustomSnackbar";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

const CTA = (props) => {
  const [email, setEmail] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onClick = () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        email: email,
      },
      response: true,
    };
    API.post("marketing", "/marketing", myInit)
      .then(() => {
        setEmail("");
        setSnackbarMessage("Successfully signed up. We'll reach out soon!");
      })
      .catch(console.log);
  };

  return (
    <Grid item container direction="row" alignItems="center">
      <Grid item>
        <InputField label="Your email" value={email} onChange={onChange} />
      </Grid>
      <Grid item>
        <CustomButton variant="contained" onClick={onClick}>
          {props.ButtonText}
        </CustomButton>
      </Grid>
      <CustomSnackbar
        message={snackbarMessage}
        setMessage={setSnackbarMessage}
      />
    </Grid>
  );
};

CTA.propTypes = {
  ButtonText: PropTypes.string,
};

export default CTA;

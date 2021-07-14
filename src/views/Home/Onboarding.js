import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import {
  CustomButton,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";
import { List, ListItem, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const Onboarding = () => {
  const [state, setState] = useState({ email: "", phoneNumber: "" });
  const history = useHistory();
  let isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const onClick = () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        email: state.email,
        // phoneNumber: state.phoneNumber,
      },
      response: true,
    };
    API.post("marketing", "/marketing", myInit)
      .then(() => {
        history.push("/success");
      })
      .catch(console.log);
  };

  return (
    <Container maxWidth="md">
      <Box m={5}>
        <Grid container direction="column">
          <Grid item>
            <TextStyle variant="h2">Share your expertise on Motion</TextStyle>
          </Grid>
          <Grid item>
            <TextStyle variant="body1">
              During our welcome process, we&apos;ll work with you to develop:
            </TextStyle>
            <List>
              <ListItem>
                <TextStyle variant="body1">1. Custom landing page</TextStyle>
              </ListItem>
              <ListItem>
                <TextStyle variant="body1">2. Your personal brand</TextStyle>
              </ListItem>
              <ListItem>
                <TextStyle variant="body1">3. Social media templates</TextStyle>
              </ListItem>
            </List>
          </Grid>
          <Box mt={5} mb={1}>
            <Grid
              item
              container
              direction={isLargeScreen ? "row" : "column"}
              alignItems="center"
            >
              <Grid item>
                <Box m={1}>
                  <TextField
                    variant="outlined"
                    onChange={(e) =>
                      setState({ ...state, phoneNumber: e.target.value })
                    }
                    value={state.phoneNumber}
                    label="Phone Number"
                  />
                </Box>
              </Grid>
              <Grid item>
                <TextStyle variant="body1">or</TextStyle>
              </Grid>
              <Grid item>
                <Box m={1}>
                  <TextField
                    onChange={(e) =>
                      setState({ ...state, email: e.target.value })
                    }
                    value={state.email}
                    variant="outlined"
                    label="Email"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Grid item>
            <CustomButton
              onClick={onClick}
              variant="contained"
              color="secondary"
            >
              Get in touch
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Onboarding;

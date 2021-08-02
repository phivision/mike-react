import React, { useState } from "react";
import {
  BannerImage,
  CustomButton,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";
import homeBanner from "../../assets/conversation.png";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Follower = () => {
  let history = useHistory();
  const [query, setQuery] = useState("");
  let isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <Container maxWidth="md">
      <Box my={10}>
        <Grid
          container
          direction={isLargeScreen ? "row" : "column"}
          alignItems="center"
        >
          <Grid item container direction="column" xs={isLargeScreen && 7}>
            <Box m={3}>
              <Grid item>
                <TextStyle variant="h1">
                  Develop your passions and learn from the best
                </TextStyle>
              </Grid>
              <Grid item>
                <TextStyle variant="body1">
                  Get guaranteed access to your favorite creators, and ask them
                  the questions you&apos;ve never been able to ask.
                </TextStyle>
              </Grid>
              <Grid item>
                <CustomButton
                  onClick={() => {
                    history.push("/join");
                  }}
                  color="secondary"
                  variant="contained"
                >
                  Start Learning Today
                </CustomButton>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={isLargeScreen && 5}>
            <Box>
              <BannerImage src={homeBanner} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box my={isLargeScreen ? 10 : 2}>
        <Grid
          container
          direction={isLargeScreen ? "row" : "column"}
          alignItems="center"
        >
          <Grid item xs>
            <Box m={1}>
              <TextStyle variant="h2">
                Learn from the people you already trust
              </TextStyle>
              <TextStyle variant="body1">
                Don&apos;t buy courses from random strangers on the internet.
                Find the creators you already know and love on our platform.
              </TextStyle>
            </Box>
          </Grid>
          <Grid item xs>
            <Box m={1}>
              <TextStyle variant="h2">Get accountability + feedback</TextStyle>
              <TextStyle variant="body1">
                Learning by yourself is tough. Our creators can help provide
                accountability and feedback to make sure you&apos;re reaching
                your goals.
              </TextStyle>
            </Box>
          </Grid>
          <Grid item xs>
            <Box m={1}>
              <TextStyle variant="h2">No ads or bullshit, ever.</TextStyle>
              <TextStyle variant="body1">
                Support the creators you love without having to deal with
                unskippable ads or two minutes of sponsored content. Get
                straight to learning about your passion.
              </TextStyle>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box my={10}>
        <Grid container direction="column">
          <Grid item>
            <Box m={1}>
              <TextStyle variant="h2">Start learning from the best.</TextStyle>
            </Box>
          </Grid>
          <Grid item>
            <Box m={1}>
              <TextField
                fullWidth
                label="Find a creator..."
                variant="outlined"
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    history.push("/search/" + query);
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Follower;

import React from "react";
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
import { useHistory } from "react-router-dom";

const Home = () => {
  let isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  let history = useHistory();

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
                  The best platform to learn + educate.
                </TextStyle>
              </Grid>
              <Grid item>
                <TextStyle variant="body1">
                  Get personalized feedback and exclusive content from the
                  creators you admire
                </TextStyle>
              </Grid>
              <Grid item>
                <CustomButton
                  onClick={() => history.push("/creator")}
                  color="secondary"
                  variant="contained"
                >
                  I&apos;m a creator
                </CustomButton>
                <CustomButton
                  onClick={() => history.push("/follower")}
                  color="primary"
                  variant="outlined"
                >
                  I&apos;m a follower
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
    </Container>
  );
};

export default Home;

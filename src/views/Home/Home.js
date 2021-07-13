import React, { useState } from "react";
import {
  BannerImage,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";
import homeBanner from "../../assets/conversation.png";
import videoViewer from "../../assets/viewer.png";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CTA from "../../components/CTA/CTA";
import { TextField } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import revenue from "../../assets/revenue.png";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const Home = () => {
  const [state, setState] = useState({ price: 8, count: 800 });

  const prices = [5, 8, 10, 15, 20, 30];
  const counts = [50, 100, 200, 400, 800, 2000, 5000, 10000, 50000];

  let isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const handleChange = (e) => {
    const name = e.target.name;
    setState({ ...state, [name]: e.target.value });
  };

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
                  Get paid for interacting with your fans.
                </TextStyle>
              </Grid>
              <Grid item>
                <TextStyle variant="body1">
                  Share what you know for a monthly subscription, and answer
                  your audience&apos;s questions for a fee. Getting started is
                  free. We only make money when you do.
                </TextStyle>
              </Grid>
              <Grid item>
                <CTA ButtonText="Become a creator" />
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
          <Grid item xs={isLargeScreen && 7}>
            <Box m={5}>
              <TextStyle variant="h2">
                Earn a consistent, monthly income
              </TextStyle>
              <TextStyle variant="body1">
                Tired of dealing with sponsorships and ads? Our monthly
                subscription allows your audience to subscribe to you in return
                for exclusive content. With Motion, you earn money directly from
                your audience, so you can focus on creating the best content.
              </TextStyle>
            </Box>
          </Grid>
          <Grid item xs={isLargeScreen && 5}>
            <Box border={2} borderRadius={5} p={3}>
              <Grid container direction="column">
                <Grid item>
                  <Box m={2}>
                    <TextStyle variant="h3">
                      Estimate how much you can earn each month
                    </TextStyle>
                  </Box>
                </Grid>
                <Grid item>
                  <Box m={1}>
                    <TextField
                      select
                      SelectProps={{
                        native: true,
                      }}
                      fullWidth
                      variant="outlined"
                      value={state.price}
                      onChange={handleChange}
                      inputProps={{ name: "price" }}
                    >
                      {prices.map((price, idx) => (
                        <option key={idx} value={price}>
                          ${price}/month
                        </option>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item>
                  <Box m={1}>
                    <TextField
                      select
                      fullWidth
                      SelectProps={{
                        native: true,
                      }}
                      variant="outlined"
                      value={state.count}
                      onChange={handleChange}
                      inputProps={{ name: "count" }}
                    >
                      {counts.map((count, idx) => (
                        <option key={idx} value={count}>
                          {count} subscribers
                        </option>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item>
                  <Box m={2}>
                    <TextStyle variant="h1">
                      ${state.count * state.price * 0.87}
                    </TextStyle>
                    <TextStyle variant="body1">per month</TextStyle>
                  </Box>
                </Grid>
              </Grid>
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
          <Grid item xs={isLargeScreen && 5}>
            <Box m={2}>
              <BannerImage src={revenue} />
            </Box>
          </Grid>
          <Grid item xs={isLargeScreen && 7}>
            <Box m={5}>
              <TextStyle variant="h2">Set your own prices</TextStyle>
              <TextStyle variant="body1">
                We give you the power to set your prices for your monthly
                subscription and each message you receive from your audience.
                You earn 90% of each subscription minus payment processing fees.
              </TextStyle>
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
          <Grid item direction="column" xs={isLargeScreen && 7}>
            <Box m={5}>
              <TextStyle variant="h2">Post what you want to post</TextStyle>
              <TextStyle variant="body1">
                Social media algorithms stop you from creating the meaningful
                content that you want to share. Our subscription model
                guarantees that you don&apos;t need to worry about how to game
                the algorithm.
              </TextStyle>
            </Box>
          </Grid>
          <Grid item xs={isLargeScreen && 5}>
            <Box m={2}>
              <BannerImage src={videoViewer} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box my={10} mx={5}>
        <TextStyle variant="h2">
          Start earning consistent monthly revenue
        </TextStyle>
        <CTA ButtonText="Become a creator" />
      </Box>
    </Container>
  );
};

export default Home;

import React from "react";
import {
  BannerImage,
  BannerText,
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";
import homeBanner from "../../assets/home-banner.png";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

//https://github.com/briancodex/react-website-v2/blob/master/src/components/HeroSection.css

const Landing = () => {
  return (
    <CustomContainer>
      <Grid container direction="row" alignItems="center">
        <Grid item container direction="column" xs>
          <BannerText>
            <Grid item>
              <TextStyle variant="h1">
                The only platform that pays you to interact with your fans.
              </TextStyle>
            </Grid>
            <Grid item>
              <TextStyle>
                Help your most dedicated fans reach their goals by sharing what
                you know and answering their questions.
              </TextStyle>
            </Grid>
          </BannerText>
        </Grid>
        <Grid item xs>
          <Box>
            <BannerImage src={homeBanner} />
          </Box>
        </Grid>
      </Grid>
    </CustomContainer>
  );
};

export default Landing;

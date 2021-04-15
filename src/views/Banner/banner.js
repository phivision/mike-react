import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import banner from "assets/img/banner.jpg";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  BannerImage: {
    background: `url(${banner}) no-repeat center top`,
    backgroundSize: "100%",
    height: "50vh",
    maxWidth: "none",
    overflow: "hidden",
    backgroundPosition: "left",
  },
  BannerTitle: {
    color: "white",
    fontWeight: 500,
    fontFamily: "Arial Rounded MT Bold",
    padding: "10%",
    lineHeight: 1.4,
    textAlign: "left",
  },
}));

const Banner = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.BannerImage}>
      <Grid item xs={8}>
        <Typography variant="h1" className={classes.BannerTitle}>
          A better way change your life
        </Typography>
      </Grid>
      <Grid item xs={4}></Grid>
    </Grid>
  );
};

export default Banner;

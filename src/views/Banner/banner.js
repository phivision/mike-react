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
    backgroundSize: "100% 100%",
    height: "60vh",
    maxWidth: "none",
    overflow: "hidden",
    backgroundPosition: "left",
  },
  BannerTitle: {
    color: "white",
    fontSize: "4.5rem",
    fontWeight: 500,
    fontFamily: "Arial Rounded MT Bold",
    lineHeight: 1.4,
    textAlign: "left",
    width: "50vh",
    margin: "auto 5rem",
  },
}));

const Banner = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.BannerImage}>
      <Typography className={classes.BannerTitle}>
        A better way change your life
      </Typography>
    </Grid>
  );
};

export default Banner;

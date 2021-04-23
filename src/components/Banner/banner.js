import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  BannerImage: {
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

const Banner = ({ bannerURL, bannerText }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.BannerImage}
      style={{ background: `url(${bannerURL}) no-repeat center top /100%` }}
    >
      <Typography className={classes.BannerTitle}>{bannerText}</Typography>
    </Grid>
  );
};

export default Banner;

Banner.propTypes = {
  bannerURL: PropTypes.string,
  bannerText: PropTypes.string,
};

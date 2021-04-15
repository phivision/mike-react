import React from "react";
import { Container } from "@material-ui/core";
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
}));

const Banner = () => {
  const classes = useStyles();
  return (
    <div>
      <Container className={classes.BannerImage}></Container>
    </div>
  );
};

export default Banner;

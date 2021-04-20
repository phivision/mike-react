import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import ShowProfile from "./ShowProfile";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  BImage: {
    background: `url(${"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2620721125,1355879679&fm=26&gp=0.jpg"})`,
    backgroundSize: "100% 100%",
    height: "50vh",
    maxWidth: "none",
    overflow: "hidden",
    backgroundPosition: "left",
  },
  BannerTitle: {
    color: "#606b6c",
    fontSize: "3rem",
    fontWeight: 500,
    fontFamily: "Arial Rounded MT Bold",
    lineHeight: 1.4,
    textAlign: "left",
    margin: "auto 5rem",
    whiteSpace: "pre",
  },
  profileSection: {
    backgroundColor: "white",
    margin: "2px",
  },
}));

const CenteredGrid = ({ profile }) => {
  const classes = useStyles();
  return !profile ? (
    "Loading..."
  ) : (
    <div>
      <Grid container className={classes.BImage}>
        <Typography className={classes.BannerTitle}>
          {"You're not alone"}
          {"\n"}
          {"The best way to practice"}
        </Typography>
      </Grid>
      <Grid container className={classes.profileSection}>
        <Grid item xs={6}>
          <ShowProfile profile={profile} />
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.CardStlye}></Card>
        </Grid>
      </Grid>
    </div>
  );
};

CenteredGrid.propTypes = {
  profile: PropTypes.object,
};

export default CenteredGrid;

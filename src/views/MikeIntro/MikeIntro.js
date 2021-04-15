import React from "react";
import { Container, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import fitness from "assets/img/fitness.jpg";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  FitnessImage: {
    background: `url(${fitness}) no-repeat center top`,
    backgroundSize: "100% 100%",
    maxWidth: "none",
    minHeight: "490px",
    overflow: "hidden",
    backgroundPosition: "right",
  },
  MikeIntroSection: {
    backgroundColor: "white",
    maxWidth: "none",
  },
  Miketitle: {
    fontWeight: 600,
    color: "#47576a",
    fontFamily: "Futura",
  },
  MikeText: {
    color: "#6a6c6d",
    fontWeight: 500,
    fontFamily: "Arial Rounded MT Bold",
    lineHeight: 1.6,
    padding: "0 10% 3% 10%",
  },
  DevAtHome: {
    backgroundColor: "#5dcbcb",
    margin: "30px 0",
    padding: "10px",
  },
  DevAtHomeTitle: {
    color: "white",
    fontWeight: 500,
    fontFamily: "Arial Rounded MT Bold",
    padding: "10%",
    lineHeight: 1.4,
    textAlign: "center",
  },
}));

const MikeIntro = () => {
  const classes = useStyles();
  return (
    <Container disableGutters={true} className={classes.MikeIntroSection}>
      <Grid item xs={12}>
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          className={classes.Miketitle}
        >
          {"What's MIKE?"}
        </Typography>
        <Typography variant="h3" className={classes.MikeText}>
          {
            "Advanced camera technology and proprietary algorithms deliver in-workout adjustments based on your goals, preferences, and personal profile."
          }
        </Typography>
      </Grid>
      <Grid container className={classes.DevAtHome}>
        <Grid item xs={6}>
          <Typography variant="h1" className={classes.DevAtHomeTitle}>
            Develop your-self at home
          </Typography>
        </Grid>
        <Grid item xs={6} className={classes.FitnessImage}></Grid>
      </Grid>
    </Container>
  );
};

export default MikeIntro;

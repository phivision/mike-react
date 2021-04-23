import React from "react";
import { Container, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import mikeIntroStyle from "assets/jss/material-dashboard-react/views/mikeIntroStyle";

const useStyles = makeStyles(mikeIntroStyle);

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

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, Typography, CardContent } from "@material-ui/core";
import PropTypes from "prop-types";
import ShowProfile from "./ShowProfile";
import landingPageStyle from "assets/jss/material-dashboard-react/views/landingpageStyle";

const useStyles = makeStyles(landingPageStyle);

const CenteredGrid = ({ profile }) => {
  const classes = useStyles();
  return !profile ? (
    "Loading..."
  ) : (
    <div>
      <Grid
        container
        className={classes.BImage}
        style={{
          background: `url(${profile.BgURL}) left top / 100% no-repeat`,
        }}
      >
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
        <Grid item xs={6} className={classes.courseSection}>
          <Typography variant="h4">Featured Courses</Typography>
          <Card className={classes.CardStlye}>
            <CardContent className={classes.CourseCardTitle}>
              8 weeks Flexibility exercise
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

CenteredGrid.propTypes = {
  profile: PropTypes.object,
};

export default CenteredGrid;

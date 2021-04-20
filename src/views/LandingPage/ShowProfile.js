import React from "react";
import {
  Card,
  Typography,
  Grid,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  Button,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import landingPageStyle from "assets/jss/material-dashboard-react/views/landingpageStyle";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import FavoriteIcon from "@material-ui/icons/Favorite";

const useStyles = makeStyles(landingPageStyle);

const ShowProfile = ({ profile }) => {
  const classes = useStyles();
  return (
    <Card className={classes.profileCardStlye}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3879298782,3698363030&fm=26&gp=0.jpg"
          />
        }
        title={profile.FirstName + " " + profile.LastName}
        subheader={
          profile.Gender +
          " | " +
          profile.Height +
          "cm | " +
          profile.Weight +
          "\n | BMI"
        }
      />
      <CardContent>
        <CardContent className={classes.CardBox}>
          <Typography variant="h6" component="h2">
            Biograpghy
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {profile.Description}
          </Typography>
        </CardContent>
      </CardContent>
      <CardActions disableSpacing>
        <Grid item xs={9}>
          <IconButton aria-label="add to favorites" color="secondary">
            <FavoriteIcon />
          </IconButton>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<MonetizationOnIcon />}
          >
            Pay
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
};

ShowProfile.propTypes = {
  profile: PropTypes.object,
};

export default ShowProfile;

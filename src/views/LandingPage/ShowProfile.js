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
  return !profile ? (
    "Loading..."
  ) : (
    <Card className={classes.profileCardStlye}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3879298782,3698363030&fm=26&gp=0.jpg"
          />
        }
        title={
          <Typography variant="h4">
            {profile.FirstName} {profile.LastName}
          </Typography>
        }
        subheader={
          <Typography variant="body1">
            {profile.Gender} | {profile.Height} cm | {profile.Weight}
            {"\n"}
            {profile.Description}
          </Typography>
        }
      />
      <CardContent>
        <CardContent className={classes.CardBox}>
          <Typography variant="h4" component="h1">
            Biograpghy
          </Typography>
          <Typography variant="h5" color="textSecondary" component="body1">
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

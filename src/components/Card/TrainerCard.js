import React, { useEffect } from "react";
import { Card, Grid, Typography, Avatar, GridList } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { API, Storage } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import landingPageStyle from "assets/jss/material-dashboard-react/views/landingpageStyle";
import yoga1 from "assets/img/yoga1.jpeg";
import yoga2 from "assets/img/yoga2.jpeg";
import avatar from "assets/img/faces/marc.jpg";
// import initial profile
import initialProfileState from "variables/profile.js";

const useStyles = makeStyles(landingPageStyle);

const TrainerCard = ({ id }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [profile, setProfile] = React.useState(initialProfileState);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  async function userQuery() {
    const userProfileData = await API.graphql({
      query: getUserProfile,
      variables: { id: id },
      authMode: "AWS_IAM",
    });
    const userProfile = userProfileData.data.getUserProfile;
    userProfile.ImageURL = userProfile.UserImage
      ? await Storage.get(userProfile.UserImage)
      : avatar;
    if (userProfile) {
      setProfile(userProfile);
    } else {
      console.log("cannot find user profile!");
    }
  }

  useEffect(() => {
    userQuery();
  }, [id]);

  const description = profile.Description
    ? profile.Description.substr(0, 100) + "..."
    : "";

  return (
    <Card className={classes.userCard}>
      <Grid container>
        <Grid item xs={8} className={classes.centerAlign}>
          <Avatar
            aria-label="image"
            className={classes.avatar}
            style={{ width: "100px", height: "100px" }}
            src={profile.ImageURL}
          />
          <Link to={{ pathname: "/landingpage/" + id }}>
            <Typography variant="h5">
              {profile.FirstName} {profile.LastName}
            </Typography>
          </Link>
          <div className={classes.profileDes} style={{ fontSize: "0.7rem" }}>
            {expanded ? profile.Description : description}
          </div>
          <div className={classes.readmore} onClick={handleExpandClick}>
            {"read more >>"}
          </div>
        </Grid>
        <Grid item xs={4}>
          <GridList cellHeight={100} cols={1} spacing={38}>
            <img src={yoga1} alt="yoga1" />
            <img src={yoga2} alt="yoga2" />
          </GridList>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TrainerCard;

TrainerCard.propTypes = {
  id: PropTypes.string,
};

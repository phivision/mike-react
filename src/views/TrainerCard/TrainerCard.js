import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  GridList,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { API, Storage } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import PropTypes from "prop-types";
import landingPageStyle from "assets/jss/material-dashboard-react/views/landingpageStyle";
import yoga1 from "assets/img/yoga1.jpeg";
import yoga2 from "assets/img/yoga2.jpeg";
import avatar from "assets/img/faces/marc.jpg";
import cover from "assets/img/cover.jpeg";

const initialProfileState = {
  id: "",
  LastName: "",
  FirstName: "",
  Description: null,
  UserImage: null,
  ImageURL: null,
  BgImage: null,
  BgURL: null,
  RegDate: "",
  Birthday: null,
  Email: "",
  Gender: null,
  Height: null,
  Weight: null,
  Price: null,
  StripID: null,
};

const useStyles = makeStyles(landingPageStyle);

const TrainerCard = ({ id }) => {
  const classes = useStyles();
  const [profile, setProfile] = React.useState(initialProfileState);

  async function userQuery() {
    const userProfileData = await API.graphql({
      query: getUserProfile,
      variables: { id: id },
      authMode: "AWS_IAM",
    });
    const userProfile = userProfileData.data.getUserProfile;
    if (userProfile.UserImage) {
      userProfile.ImageURL = await Storage.get(userProfile.UserImage);
    } else {
      userProfile.ImageURL = avatar;
    }
    if (userProfile.BgImage) {
      userProfile.BgURL = await Storage.get(userProfile.BgImage);
    } else {
      userProfile.BgURL = cover;
    }
    if (userProfile) {
      setProfile(userProfile);
    } else {
      console.log("cannot find user profile!");
    }
  }

  useEffect(() => {
    userQuery();
  }, [id]);

  return (
    <Card className={classes.userCard}>
      <Grid container>
        <Grid item xs={7} className={classes.centerAlign}>
          <Avatar
            aria-label="image"
            className={classes.avatar}
            style={{ width: "100px", height: "100px" }}
            src={profile.ImageURL}
          />
          <Typography variant="h5">
            {profile.FirstName} {profile.LastName}
          </Typography>
          <div className={classes.profileDes} style={{ fontSize: "0.7rem" }}>
            {profile.Description}
          </div>
          <div className={classes.readmore}>{"read more >>"}</div>
        </Grid>
        <Grid item xs={5}>
          <GridList cellHeight={120} cols={1} spacing={20}>
            <img src={yoga1} alt="yoga1" />
            <img src={yoga2} alt="yoga2" />
          </GridList>
        </Grid>
      </Grid>
      <CardContent>
        {id}
        dskdjskldsl
      </CardContent>
    </Card>
  );
};

export default TrainerCard;

TrainerCard.propTypes = {
  id: PropTypes.string,
};
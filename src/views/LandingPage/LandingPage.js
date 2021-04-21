import React, { useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import PropTypes from "prop-types";
import {
  Container,
  Grid,
  Card,
  Typography,
  CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import landingPageStyle from "assets/jss/material-dashboard-react/views/landingpageStyle";
import ShowProfile from "./ShowProfile";
import avatar from "assets/img/faces/marc.jpg";
import cover from "assets/img/cover.jpeg";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

//TODO: Add payment functionality
//TODO: Add cards for payment tiers
//TODO: Add images + description, nicely formatted
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

export default function LandingPage({ ...props }) {
  const [profile, setProfile] = React.useState(initialProfileState);
  const history = useHistory();

  async function userQuery() {
    const userProfileData = await API.graphql({
      query: getUserProfile,
      variables: { id: props.props.match.params.id },
      authMode: "AWS_IAM",
    });
    const userProfile = userProfileData.data.getUserProfile;
    console.log("userProfile", userProfile);
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

  const onSubmit = () => {
    history.push({
      pathname: "/admin/checkout/" + profile.id,
    });
  };

  useEffect(() => {
    userQuery();
  }, [props.props.match.params.id]);

  const classes = useStyles();

  return !profile ? (
    "Loading..."
  ) : (
    <Container className={classes.container}>
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
      <div>
        <h4>{profile.FirstName + " " + profile.LastName}</h4>
        <p>{profile.Description}</p>
        <p>{profile.Price}</p>
        <Button onClick={() => onSubmit()}>Subscribe</Button>
      </div>
    </Container>
  );
}

LandingPage.propTypes = {
  props: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }),
  }),
};

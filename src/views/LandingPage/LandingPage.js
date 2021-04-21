import React, { useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import PropTypes from "prop-types";
import CenteredGrid from "./LandingLayout";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import landingPageStyle from "assets/jss/material-dashboard-react/views/landingpageStyle";

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
    }
    console.log("ImageURL", userProfile.ImageURL, userProfile.UserImage);
    if (userProfile.BgImage) {
      userProfile.BgURL = await Storage.get(userProfile.BgImage);
    }
    if (userProfile) {
      setProfile(userProfile);
    } else {
      console.log("cannot find user profile!");
    }
  }

  useEffect(() => {
    userQuery();
  }, [props.props.match.params.id]);

  const classes = useStyles();

  return !profile ? (
    "Loading..."
  ) : (
    <Container className={classes.container}>
      <CenteredGrid profile={profile}></CenteredGrid>
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

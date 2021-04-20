import React, { useEffect } from "react";
import { API } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import PropTypes from "prop-types";
import CenteredGrid from "./LandingLayout";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import landingPageStyle from "assets/jss/material-dashboard-react/views/landingpageStyle";

//TODO: Add payment functionality
//TODO: Add cards for payment tiers
//TODO: Add images + description, nicely formatted
const useStyles = makeStyles(landingPageStyle);
export default function LandingPage({ ...props }) {
  const [profile, setProfile] = React.useState();

  async function userQuery() {
    const userProfile = await API.graphql({
      query: getUserProfile,
      variables: { id: props.props.match.params.id },
      authMode: "AWS_IAM",
    });
    console.log(userProfile.data);
    if (userProfile.data.getUserProfile != null) {
      return userProfile.data.getUserProfile;
    }
  }

  useEffect(() => {
    userQuery()
      .then((r) => setProfile(r))
      .catch(console.log);
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

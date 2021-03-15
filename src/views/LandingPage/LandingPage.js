import React, { useEffect } from "react";
import { API } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import PropTypes from "prop-types";

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
    userQuery().then((r) => setProfile(r));
  }, [props.props.match.params.id]);

  return !profile ? (
    "Loading..."
  ) : (
    <div>
      <h4>{profile.FirstName + " " + profile.LastName}</h4>
      <p>{profile.Bio}</p>
      <p>{profile.Price}</p>
    </div>
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

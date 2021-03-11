import React, { useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import PropTypes from "prop-types";

const initialProfileState = {
  id: "",
  LastName: "Smith",
  FirstName: "John",
  UserImage: null,
  RegDate: "",
  UserRole: "",
  Birthday: null,
  Email: null,
  Gender: null,
  Height: null,
  Weight: null,
  Price: "$9.00",
  StripID: null,
  Bio:
    "I can feel the changes. I can feel the people around me just want to be famous.",
};

export default function LandingPage({ ...props }) {
  const [profile, setProfile] = React.useState(initialProfileState);

  async function userQuery() {
    const userProfile = await API.graphql(
      graphqlOperation(getUserProfile, { id: props.props.match.params.id })
    );
    if (userProfile.data.getUserProfile != null) {
      return userProfile.data.getUserProfile;
    } else {
      alert("cannot find user profile!");
    }
  }

  useEffect(() => {
    userQuery().then((r) => setProfile(r));
    // TODO: need to do useEffect cleanup and fix uncaught (in promise) object
  });

  return (
    <div>
      <h4>{profile.FirstName + " " + profile.LastName}</h4>
      <p>{profile.Bio}</p>
      <p>{profile.Price}</p>
    </div>
  );

  //TO-DO: Need to add subscription plan queries + handling.
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

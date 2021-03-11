import React from "react";
/**import { API, graphqlOperation } from "aws-amplify";
import { getUserProfile } from "graphql/queries";*/

export default function LandingPage() {
  /**const [profile, setProfile] = React.useState(initialProfileState);

  async function userQuery() {
    const userProfile = await API.graphql(
      graphqlOperation(getUserProfile, { id: props.user })
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
  });*/

  return <div>Hello</div>;
}

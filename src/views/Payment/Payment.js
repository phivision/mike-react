import React from "react";
import { API, Auth } from "aws-amplify";
import { getUserProfile } from "../../graphql/queries";
import { Button } from "@material-ui/core";

export default function Payment() {
  async function userQuery(cognitoID) {
    const userProfile = await API.graphql({
      query: getUserProfile,
      variables: { id: cognitoID },
    });
    if (userProfile.data.getUserProfile != null) {
      return userProfile.data.getUserProfile;
    }
  }

  //TODO: Need to redo refresh + return URLs later, when actually deployed to domain to use window.location.href + logic
  const getLink = async () => {
    await Auth.currentAuthenticatedUser().then(async (attributes) => {
      await userQuery(attributes.username).then((userProfile) => {
        const myInit = {
          headers: {}, // AWS-IAM authorization if using empty headers
          body: {
            connectedID: userProfile.StripeID,
            refreshUrl: "https://www.google.com",
            returnUrl: "https://www.google.com",
            // refreshUrl: window.location.href,
            // returnUrl: window.location.href,
          },
          response: true,
        };

        API.post("stripeAPI", "/stripe/api/onboarding", myInit)
          .then((res) => {
            window.location.href = res.data.AccountLink;
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  };

  return (
    <div>
      <Button
        onClick={() => {
          getLink();
        }}
      >
        Stripe Dashboard
      </Button>
    </div>
  );
}

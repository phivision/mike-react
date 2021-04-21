import React from "react";
import { API, Auth } from "aws-amplify";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

export default function Checkout({ ...props }) {
  //TODO: Need to redo refresh + return URLs later, when actually deployed to domain to use window.location.href + logic
  const getLink = async () => {
    await Auth.currentAuthenticatedUser().then((attributes) => {
      const myInit = {
        headers: {}, // AWS-IAM authorization if using empty headers
        body: {
          customerID: attributes.username,
          trainerID: props.user,
          success_url: "https://www.google.com",
          cancel_url: "https://www.google.com",
          // refreshUrl: window.location.href,
          // returnUrl: window.location.href,
        },
        response: true,
      };

      API.post("stripeAPI", "/stripe/api/checkout", myInit)
        .then((res) => {
          console.log(res);
          // window.location.href = res.data.AccountLink;
        })
        .catch((err) => {
          console.log(err);
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

Checkout.propTypes = {
  user: PropTypes.string.isRequired,
};

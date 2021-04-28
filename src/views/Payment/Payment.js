import React from "react";
import { API } from "aws-amplify";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

//TODO: replace with Live URL
export default function Payment({ ...props }) {
  const onboard = async () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user,
        refreshUrl: "http://localhost:3000/admin/dashboard",
        returnUrl: "http://localhost:3000/admin/dashboard",
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/link/onboarding", myInit)
      .then((res) => {
        window.location.href = res.data.AccountLink;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = async () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/link/login", myInit)
      .then((res) => {
        window.location.href = res.data.AccountLink;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPrices = async () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/get/prices", myInit)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBalance = async () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/get/balance", myInit)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <Button onClick={() => onboard()}>Stripe Onboarding</Button>
      <Button onClick={() => login()}>Stripe Login</Button>
      <Button onClick={() => getPrices()}>Get Prices</Button>
      <Button onClick={() => getBalance()}>Get Balance</Button>
    </div>
  );
}

Payment.propTypes = {
  user: PropTypes.string,
};

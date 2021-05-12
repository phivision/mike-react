import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { API } from "aws-amplify";
import PropTypes from "prop-types";

export default function Checkout({ ...props }) {
  const stripe = useStripe();
  const elements = useElements();

  const createSubscription = ({ trainerID, customerID, paymentMethodId }) => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        trainerID: trainerID,
        customerID: customerID,
        paymentMethodID: paymentMethodId,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/create/subscription", myInit).then(
      (res) => {
        if (res.error) {
          props.errorCallback(res.error);
        } else {
          props.successCallback();
        }
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payment = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });
      createSubscription({
        trainerID: props.trainerID,
        customerID: props.userID,
        paymentMethodId: payment.paymentMethod.id,
      });
    } catch (e) {
      props.errorCallback(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    </div>
  );
}

Checkout.propTypes = {
  userID: PropTypes.string,
  trainerID: PropTypes.string,
  successCallback: PropTypes.func,
  errorCallback: PropTypes.func,
};

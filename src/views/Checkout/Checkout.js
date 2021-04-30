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

    API.post("stripeAPI", "/stripe/api/user/checkout", myInit)
      .then((res) => {
        console.log(res);
      })
      .then((result) => {
        if (result.error) {
          throw result;
        }
        return result;
      })
      .then((result) => {
        return {
          subscription: result,
        };
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payment = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (payment.error) {
      console.log(payment.error);
    } else {
      createSubscription({
        trainerID: props.props.match.params.id,
        customerID: props.user,
        paymentMethodId: payment.paymentMethod.id,
      });
    }
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
  user: PropTypes.string,
  props: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }),
  }),
};

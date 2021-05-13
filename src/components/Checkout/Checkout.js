import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";

export default function Checkout({ ...props }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payment = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });
      props.paymentMethodCallback(payment.paymentMethod.id);
    } catch (e) {
      props.errorCallback(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          {props.buttonTitle}
        </button>
      </form>
    </div>
  );
}

Checkout.propTypes = {
  errorCallback: PropTypes.func,
  paymentMethodCallback: PropTypes.func,
  buttonTitle: PropTypes.string,
};

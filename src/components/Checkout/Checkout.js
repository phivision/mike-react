import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import { API } from "aws-amplify";
import { userRoles } from "../../variables/userRoles";
import PaymentMethod from "../PaymentMethod/PaymentMethod";
import {
  CustomButton,
  CustomContainer,
  TextStyle,
} from "../StyledComponents/StyledComponents";

export default function Checkout({ ...props }) {
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const stripe = useStripe();
  const elements = useElements();

  const fetchPaymentMethod = () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user.id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/get/payment", myInit)
      .then((d) => {
        setPaymentMethods(d.data.data);
      })
      .catch(console.log);
  };

  const fetchDefaultPaymentMethod = () => {
    if (props.user.role === userRoles.STUDENT) {
      const myInit = {
        headers: {}, // AWS-IAM authorization if using empty headers
        body: {
          id: props.user.id,
        },
        response: true,
      };

      API.post("stripeAPI", "/stripe/api/user/get/customer", myInit)
        .then((d) => {
          console.log(
            "Default Payment Method: " +
              d.data.invoice_settings.default_payment_method
          );
          setDefaultPaymentMethod(
            d.data.invoice_settings.default_payment_method
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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

  const onClick = () => {
    props.paymentMethodCallback(defaultPaymentMethod);
  };

  useEffect(() => {
    if (props.checkExistingPaymentMethod) {
      fetchPaymentMethod();
      fetchDefaultPaymentMethod();
    }
  }, [props.checkExistingPaymentMethod]);

  return (
    <>
      {defaultPaymentMethod ? (
        <CustomContainer>
          <TextStyle variant="h3">Checkout</TextStyle>
          <TextStyle variant="body1">
            Using default payment method. To change payment methods, go to
            settings.
          </TextStyle>
          {paymentMethods.map((p, idx) => {
            let isDefault = p.id === defaultPaymentMethod;
            return isDefault ? (
              <div style={{ padding: "15px" }} key={idx}>
                <PaymentMethod PaymentMethod={p} key={idx} />
              </div>
            ) : null;
          })}
          <CustomButton variant="contained" onClick={onClick}>
            {props.buttonTitle}
          </CustomButton>
        </CustomContainer>
      ) : (
        <CustomContainer>
          <form onSubmit={handleSubmit}>
            <div style={{ padding: "10px" }}>
              <CardElement />
            </div>
            <CustomButton variant="contained" type="submit" disabled={!stripe}>
              {props.buttonTitle}
            </CustomButton>
          </form>
        </CustomContainer>
      )}
    </>
  );
}

Checkout.propTypes = {
  errorCallback: PropTypes.func,
  paymentMethodCallback: PropTypes.func,
  buttonTitle: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
  checkExistingPaymentMethod: PropTypes.bool,
};

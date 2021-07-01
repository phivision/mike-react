import React, { useState } from "react";
import {
  CustomButton,
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";
import Grid from "@material-ui/core/Grid";
import { API } from "aws-amplify";
import { Dialog } from "@material-ui/core";
import Checkout from "../../components/Checkout/Checkout";
import { useStripe } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";

const TokenPurchase = (props) => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openCheckout, setOpenCheckout] = useState(false);
  const [paymentIntentID, setPaymentIntentID] = useState("");
  const stripe = useStripe();

  const purchase = (count) => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        coinCount: count,
        id: props.user.id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/buy/coins", myInit)
      .then((res) => {
        setPaymentIntentID(res.data);
        setOpenCheckout(true);
      })
      .catch(console.log);
  };

  const purchaseCoins = (paymentMethodID) => {
    stripe
      .confirmCardPayment(paymentIntentID, {
        payment_method: paymentMethodID,
      })
      .then((p) => {
        console.log(p);
        setOpenCheckout(false);
        setSnackbarMessage("Purchase successful.");
      })
      .catch(console.log);
  };

  const checkoutError = () => {
    setSnackbarMessage("Purchase unsuccessful. Please try again.");
  };

  return (
    <>
      <CustomContainer>
        <Grid container alignItems="center">
          <Grid item>
            <TextStyle variant="h3">10 Coins</TextStyle>
            <CustomButton variant="contained" onClick={() => purchase(10)}>
              Buy
            </CustomButton>
          </Grid>
          <Grid item>
            <TextStyle variant="h3">50 Coins</TextStyle>
            <CustomButton variant="contained" onClick={() => purchase(50)}>
              Buy
            </CustomButton>
          </Grid>
          <Grid item>
            <TextStyle variant="h3">150 Coins</TextStyle>
            <CustomButton variant="contained" onClick={() => purchase(150)}>
              Buy
            </CustomButton>
          </Grid>
        </Grid>
      </CustomContainer>
      <Dialog
        onClose={() => setOpenCheckout(true)}
        fullWidth
        aria-labelledby="checkout-dialog"
        open={openCheckout}
      >
        <Checkout
          errorCallback={checkoutError}
          user={props.user}
          paymentMethodCallback={purchaseCoins}
          buttonTitle="Purchase"
          checkExistingPaymentMethod={true}
        />
      </Dialog>
      <CustomSnackbar
        setMessage={setSnackbarMessage}
        message={snackbarMessage}
      />
    </>
  );
};

TokenPurchase.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default TokenPurchase;

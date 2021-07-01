import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { CustomButton, TextStyle } from "../StyledComponents/StyledComponents";
import { API } from "aws-amplify";

const CashOut = (props) => {
  const [balance, setBalance] = useState();

  useEffect(() => {
    setBalance(props.balance);
  }, [props.balance]);

  const onClick = () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user.id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/cashout", myInit)
      .then(() => {
        props.changeBalance(0);
        props.errorCallback("Cash out successful.");
      })
      .catch((e) => {
        console.log(e);
        props.errorCallback("Cash out unsuccessful.");
      });
  };

  return (
    <Grid
      item
      container
      direction="row"
      alignItems="center"
      justify="space-between"
      style={{ padding: "10px" }}
    >
      <Grid item>
        <TextStyle variant="h3">Balance: </TextStyle>
        <TextStyle variant="body1">{balance} Coins</TextStyle>
      </Grid>
      <Grid item>
        <CustomButton variant="contained" onClick={onClick}>
          Cash Out to Stripe
        </CustomButton>
      </Grid>
    </Grid>
  );
};

CashOut.propTypes = {
  balance: PropTypes.number,
  errorCallback: PropTypes.func,
  changeBalance: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default CashOut;

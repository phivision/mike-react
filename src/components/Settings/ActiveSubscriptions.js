import React from "react";
import PropTypes from "prop-types";
import { API } from "aws-amplify";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { CustomButton } from "../StyledComponents/StyledComponents";
import { TrainerCard } from "../Card/TrainerCard";

export default function ActiveSubscriptions(props) {
  const deleteSubscription = async (stripeID, subscriptionID) => {
    const myInit = {
      headers: {},
      body: {
        stripeID: stripeID,
        subscriptionID: subscriptionID,
      },
      response: true,
    };

    console.log(myInit);

    await API.post(
      "stripeAPI",
      "/stripe/api/user/delete/subscription",
      myInit
    ).catch((err) => {
      console.log(err);
    });
  };

  return (
    <Grid
      item
      container
      alignItems="center"
      justify="space-between"
      style={{ padding: "10px" }}
    >
      <Grid item xs>
        <Typography variant="h3">Active Subscriptions</Typography>
      </Grid>
      <Grid item container xs justify="flex-end">
        {props.trainers.map((trainerData, idx) => (
          <Grid item container justify="space-around" key={idx}>
            <Grid item align="left">
              <TrainerCard
                trainer={trainerData.Trainer}
                expire={trainerData.ExpireDate}
                CancelAtPeriodEnd={trainerData.CancelAtPeriodEnd}
              />
            </Grid>
            <Grid item align="right">
              {trainerData.CancelAtPeriodEnd ? (
                <CustomButton variant="outlined" disabled>
                  Canceled
                </CustomButton>
              ) : (
                <CustomButton
                  onClick={() =>
                    deleteSubscription(trainerData.StripeID, trainerData.id)
                  }
                >
                  Cancel Subscription
                </CustomButton>
              )}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

ActiveSubscriptions.propTypes = {
  trainers: PropTypes.arrayOf(
    PropTypes.shape({
      Trainer: PropTypes.shape({
        UserImage: PropTypes.string,
        FirstName: PropTypes.string,
        LastName: PropTypes.string,
      }),
      ExpireDate: PropTypes.string,
      StripeID: PropTypes.string,
      id: PropTypes.string,
      CancelAtPeriodEnd: PropTypes.bool,
    })
  ),
};

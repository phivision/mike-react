import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { API, Storage } from "aws-amplify";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { CustomButton } from "../StyledComponents/StyledComponents";

const TrainerCard = ({ trainer, expire, CancelAtPeriodEnd }) => {
  const [imageURL, setImageURL] = useState();
  const fullName = trainer.FirstName + " " + trainer.LastName;
  const date = new Date(expire);
  const options = { year: "numeric", month: "long", day: "numeric" };

  async function getTrainerImage() {
    return await Storage.get(trainer.UserImage);
  }

  useEffect(() => {
    getTrainerImage().then((url) => {
      setImageURL(url);
    });
  });
  return (
    <Card>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ padding: "10px" }}>
          <Avatar alt={fullName} src={imageURL} />
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <Typography variant="h6">{fullName}</Typography>
          <Typography>
            {CancelAtPeriodEnd
              ? "Your subscription will expire at "
              : "Your next billing date is "}
            {date.toLocaleDateString("en-US", options)}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

TrainerCard.propTypes = {
  trainer: PropTypes.shape({
    UserImage: PropTypes.string,
    FirstName: PropTypes.string,
    LastName: PropTypes.string,
  }),
  expire: PropTypes.string,
  CancelAtPeriodEnd: PropTypes.bool,
};

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

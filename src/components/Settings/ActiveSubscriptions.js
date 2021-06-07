import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { API, Storage } from "aws-amplify";
import TableBody from "@material-ui/core/TableBody";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import { Button, TableCell, Typography } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";

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
      <Avatar alt={fullName} src={imageURL} />
      <div>
        <Typography variant="h6">{fullName}</Typography>
        <Typography>
          {CancelAtPeriodEnd
            ? "Your subscription will expire at "
            : "Your next billing date is "}
          {date.toLocaleDateString("en-US", options)}
        </Typography>
      </div>
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
    <TableBody>
      <TableRow>
        <TableCell rowSpan={props.trainers.length + 1} align="left">
          <Typography variant="h3">Active Subscriptions</Typography>
        </TableCell>
        <TableCell colSpan={2} />
      </TableRow>
      {props.trainers.map((trainerData, idx) => (
        <TableRow key={idx}>
          <TableCell align="left">
            <TrainerCard
              trainer={trainerData.Trainer}
              expire={trainerData.ExpireDate}
              CancelAtPeriodEnd={trainerData.CancelAtPeriodEnd}
            />
          </TableCell>
          <TableCell align="right">
            {trainerData.CancelAtPeriodEnd ? (
              <Button variant="outlined" disabled>
                Canceled
              </Button>
            ) : (
              <Button
                onClick={() =>
                  deleteSubscription(trainerData.StripeID, trainerData.id)
                }
              >
                Cancel Subscription
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
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

import React, { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import blank from "assets/faces/blank.png";

export const TrainerCard = ({ trainer, expire, CancelAtPeriodEnd }) => {
  const [imageURL, setImageURL] = useState();
  const fullName = trainer.FirstName + " " + trainer.LastName;
  const date = new Date(expire);
  const options = { year: "numeric", month: "long", day: "numeric" };

  async function getTrainerImage() {
    if (trainer.UserImage) {
      return await Storage.get(trainer.UserImage);
    }
    return blank;
  }

  useEffect(() => {
    getTrainerImage().then((url) => {
      setImageURL(url);
    });
  }, [trainer]);
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

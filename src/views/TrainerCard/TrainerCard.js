import React from "react";
import { Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  BannerImage: {
    height: "60vh",
    maxWidth: "none",
    overflow: "hidden",
    backgroundPosition: "left",
  },
  BannerTitle: {
    color: "white",
    fontSize: "4.5rem",
    fontWeight: 500,
    fontFamily: "Arial Rounded MT Bold",
    lineHeight: 1.4,
    textAlign: "left",
    width: "50vh",
    margin: "auto 5rem",
  },
}));

const TrainerCard = ({ id }) => {
  const classes = useStyles();
  return (
    <Card>
      {id}
    </Card>

  );
};

export default TrainerCard;

TrainerCard.propTypes = {
  id: PropTypes.string,
};

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardMedia, Grid, Typography } from "@material-ui/core";
import { Storage } from "aws-amplify";
import { useHistory } from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";
import TrainerMetrics from "../TrainerMetrics/TrainerMetrics";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  CardStyle: {
    borderRadius: "20px",
  },
  CardGrid: {
    padding: "20px",
  },
  CardIcon: {
    height: "100px",
    width: "100px",
    borderRadius: "30px",
  },
}));

const ProfileCard = ({ ...props }) => {
  const [img, setImg] = useState();
  const classes = useStyles();
  let history = useHistory();

  useEffect(() => {
    Storage.get(props.profile.UserImage).then((d) => {
      setImg(d);
    });
  }, [props]);

  const link = () => {
    history.push("/landingpage/" + props.profile.id);
  };

  return (
    <Card className={classes.CardStyle}>
      <CardActionArea onClick={link}>
        <Grid container direction="row" className={classes.CardGrid}>
          <Grid item xs={2}>
            {img && <CardMedia image={img} className={classes.CardIcon} />}
          </Grid>
          <Grid item container direction="column" xs={5}>
            <Grid item>
              <Typography variant="h3">
                {props.profile.FirstName + " " + props.profile.LastName}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                {props.profile.Description}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <TrainerMetrics
              weight={props.profile.Weight}
              height={props.profile.Height}
              birthday={props.profile.Birthday}
            />
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
};

export default ProfileCard;

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    FirstName: PropTypes.string,
    LastName: PropTypes.string,
    Description: PropTypes.string,
    Weight: PropTypes.number,
    Height: PropTypes.number,
    Birthday: PropTypes.string,
    UserImage: PropTypes.string,
    id: PropTypes.string,
  }),
};

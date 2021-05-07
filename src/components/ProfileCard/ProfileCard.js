import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardMedia, Grid, Typography } from "@material-ui/core";
import { Storage } from "aws-amplify";
import { useHistory } from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";

const ProfileCard = ({ ...props }) => {
  const [img, setImg] = useState();
  let history = useHistory();

  useEffect(() => {
    Storage.get(props.profile.UserImage).then((d) => {
      setImg(d);
    });
  }, [props]);

  const link = () => {
    history.push("/home/landingpage/" + props.profile.id);
  };

  return (
    <Card>
      <CardActionArea onClick={link}>
        <Grid container direction="row">
          <Grid item xs={1}>
            {img && (
              <CardMedia
                image={img}
                style={{ height: "100px", width: "100px", paddingTop: "2%" }}
              />
            )}
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
          <Grid item container direction="row" xs={6}>
            <Grid item container direction="column" xs={2}>
              <Grid item>
                <Typography variant="h6">Weight</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h3" style={{ display: "inline-block" }}>
                  {props.profile.Weight}
                </Typography>
                <Typography variant="body2" style={{ display: "inline-block" }}>
                  lb
                </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" xs={2}>
              <Grid item>
                <Typography variant="h6">Height</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h3" style={{ display: "inline-block" }}>
                  {Math.floor(props.profile.Height / 12) +
                    "' " +
                    (props.profile.Height % 12) +
                    '"'}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" xs={2}>
              <Grid item>
                <Typography variant="h6">Age</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h3" style={{ display: "inline-block" }}>
                  {new Date().getFullYear() -
                    new Date(props.profile.Birthday).getFullYear()}
                </Typography>
                <Typography variant="body2" style={{ display: "inline-block" }}>
                  yr
                </Typography>
              </Grid>
            </Grid>
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

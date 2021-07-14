import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Storage } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { Card, CardActionArea, Typography } from "@material-ui/core";
import { CardIcon } from "../StyledComponents/StyledComponents";
import avatar from "assets/empty.jpg";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const ProfileCard = ({ ...props }) => {
  const [img, setImg] = useState(avatar);
  let history = useHistory();
  let isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  useEffect(() => {
    if (props.profile.UserImage) {
      Storage.get(props.profile.UserImage).then((d) => {
        setImg(d);
      });
    }
  }, [props.profile.UserImage]);

  const link = () => {
    history.push("/user/" + props.profile.id);
  };

  return (
    <Card elevation={0}>
      <CardActionArea onClick={link}>
        <Box m={1}>
          <Grid container alignItems="center" direction="row">
            <Grid item xs={isLargeScreen ? 1 : 2}>
              <CardIcon src={img} />
            </Grid>
            <Grid item xs>
              <Box mx={5}>
                <Typography variant="h3">
                  {props.profile.FirstName + " " + props.profile.LastName}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
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

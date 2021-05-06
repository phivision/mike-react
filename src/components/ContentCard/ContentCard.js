import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Card, Grid, Typography, Link, CardMedia } from "@material-ui/core";
import { FavoriteBorder } from "@material-ui/icons";

import { Storage } from "aws-amplify";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";

export default function ContentCard({ ...props }) {
  const [img, setImg] = useState();
  const [favorite, setFavorite] = useState(false);

  console.log(favorite);

  useEffect(() => {
    Storage.get("Thumbnail" + props.post.ContentName).then((url) => {
      console.log(url);
      setImg(url);
    });
  }, [props]);

  return (
    <Card>
      <Grid container direction="column">
        <Grid item container xs>
          <Grid item xs>
            <Typography variant="h3">{props.post.Description}</Typography>
          </Grid>
          <Grid item xs>
            <IconButton
              aria-label="favorite this post"
              color="primary"
              onClick={() => {
                setFavorite(!favorite);
              }}
            >
              {favorite ? <FavoriteIcon /> : <FavoriteBorder />}
            </IconButton>
          </Grid>
        </Grid>
        <Grid item container xs>
          <CardMedia image={img} />
        </Grid>
        <Grid item container xs>
          <Grid item xs>
            <Typography variant="body2">
              {new Date(props.post.createdAt).toDateString()}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="body2">
              {props.post.Creator.FirstName + " " + props.post.Creator.LastName}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {() => {
        if (props.editCallback) {
          return (
            <Link
              variant="h2"
              onClick={(e) => {
                e.preventDefault();
                props.editCallback();
              }}
            >
              Edit
            </Link>
          );
        }
      }}
    </Card>
  );
}

ContentCard.propTypes = {
  post: PropTypes.shape({
    Description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    Creator: PropTypes.shape({
      FirstName: PropTypes.string.isRequired,
      LastName: PropTypes.string.isRequired,
    }),
    ContentName: PropTypes.string.isRequired,
  }),
  editCallback: PropTypes.func,
};

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Card, Grid, Typography, CardMedia } from "@material-ui/core";
import { FavoriteBorder } from "@material-ui/icons";

import { Storage } from "aws-amplify";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CardActionArea from "@material-ui/core/CardActionArea";

export default function ContentCard({ ...props }) {
  const [img, setImg] = useState();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    props.favorite ? setLiked(true) : setLiked(false);
  }, [props.favorite]);

  useEffect(() => {
    Storage.get(props.post.Thumbnail).then((url) => {
      setImg(url);
    });
  }, [props.post.Thumbnail]);

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
                setLiked(!liked);
                props.favoriteCallback(props.favorite, props.post.id);
              }}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorder />}
            </IconButton>
          </Grid>
        </Grid>
        <Grid item container xs>
          <CardActionArea onClick={props.clickCallback}>
            {img && (
              <CardMedia
                image={img}
                style={{ height: "250px", width: "250px", paddingTop: "2%" }}
                title="Content Thumbnail"
              />
            )}
          </CardActionArea>
        </Grid>
        <Grid item container xs>
          <Grid item xs>
            <Typography variant="body2">
              {new Date(props.post.createdAt).toDateString()}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="body2">
              {props.user.FirstName + " " + props.user.LastName}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

ContentCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    Thumbnail: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    FirstName: PropTypes.string.isRequired,
    LastName: PropTypes.string.isRequired,
  }),
  favorite: PropTypes.object,
  favoriteCallback: PropTypes.func.isRequired,
  clickCallback: PropTypes.func,
};

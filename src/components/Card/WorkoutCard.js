import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Card, CardMedia, Typography } from "@material-ui/core";

import { Storage } from "aws-amplify";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { FavoriteBorder } from "@material-ui/icons";

import ViewerDialog from "../../views/ContentViewer/ViewerDialog";
import ImageButton from "../CustomButtons/ImageButton";

import empty from "assets/img/empty.jpg";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";

export default function WorkoutCard(props) {
  const [img, setImg] = useState(empty);
  const [liked, setLiked] = useState(true);
  const [openViewer, setOpenViewer] = React.useState(false);

  const handleOpenViewer = () => {
    setOpenViewer(true);
  };

  const handleCloseViewer = () => {
    setOpenViewer(false);
  };

  useEffect(() => {
    if (props.post.Thumbnail) {
      Storage.get(props.post.Thumbnail).then((url) => {
        setImg(url);
      });
    }
  }, [props.post.Thumbnail]);

  return (
    <Card>
      <GridContainer>
        <GridItem xs={12}>
          <Typography variant="h3">{props.post.Title}</Typography>
        </GridItem>
        <GridItem xs={12}>
          {props.post.ContentName ? (
            <ImageButton url={img} onClick={handleOpenViewer} width="100%" />
          ) : (
            <Card>
              <CardMedia
                style={{ height: "150px" }}
                image={img}
                title={props.post.Title}
              />
            </Card>
          )}
        </GridItem>
        {props.favoriteCallback && (
          <GridItem xs={12}>
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
          </GridItem>
        )}
      </GridContainer>
      <ViewerDialog
        open={openViewer}
        onClose={handleCloseViewer}
        post={props.post}
      />
    </Card>
  );
}

WorkoutCard.propTypes = {
  post: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    Thumbnail: PropTypes.string.isRequired,
    ContentName: PropTypes.string,
    owner: PropTypes.string.isRequired,
  }),
  trainer: PropTypes.shape({
    FirstName: PropTypes.string,
    LastName: PropTypes.string,
    id: PropTypes.string,
  }),
  favorite: PropTypes.object,
  onCloseEditor: PropTypes.func,
  favoriteCallback: PropTypes.func,
};

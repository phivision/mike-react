import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Card, Grid, Typography } from "@material-ui/core";
import { FavoriteBorder } from "@material-ui/icons";

import { Storage } from "aws-amplify";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import UserAvatar from "../UserAvatar/UserAvatar";
import Button from "@material-ui/core/Button";
import ViewerDialog from "../../views/ContentViewer/ViewerDialog";
import ImageButton from "../CustomButtons/ImageButton";
import UploadDialog from "../../views/ContentUpload/UploadDialog";
import empty from "assets/img/empty.jpg";

export default function ContentCard(props) {
  const [img, setImg] = useState(empty);
  const [liked, setLiked] = useState(false);
  const [openViewer, setOpenViewer] = React.useState(false);
  const [openContentEdit, setOpenContentEdit] = React.useState(false);

  const handleOpenContentEdit = () => {
    setOpenContentEdit(true);
  };

  const handleCloseContentEdit = () => {
    setOpenContentEdit(false);
    props.onCloseEditor();
  };

  const handleOpenViewer = () => {
    setOpenViewer(true);
  };

  const handleCloseViewer = () => {
    setOpenViewer(false);
  };

  useEffect(() => {
    props.favorite ? setLiked(true) : setLiked(false);
  }, [props.favorite]);

  useEffect(() => {
    if (props.post.Thumbnail) {
      Storage.get(props.post.Thumbnail).then((url) => {
        setImg(url);
      });
    }
  }, [props.post.Thumbnail]);

  useEffect(() => {
    if (props.UserImage) {
      Storage.get();
    }
  });

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
          <ImageButton
            url={img}
            title={props.post.Title}
            onClick={handleOpenViewer}
            width="50%"
          />
        </Grid>
        <Grid item container xs>
          {props.showTrainer && (
            <>
              <Grid item xs>
                <UserAvatar UserImage={props.UserImage} />
              </Grid>
              <Grid item xs>
                <Typography variant="body2">
                  {props.user.FirstName + " " + props.user.LastName}
                </Typography>
              </Grid>
            </>
          )}
          <Grid item xs>
            <Typography variant="body2">
              {new Date(props.post.createdAt).toDateString()}
            </Typography>
          </Grid>
          {props.post.owner === props.user.id && (
            <Grid item xs>
              <Button onClick={handleOpenContentEdit}>Edit</Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <ViewerDialog
        post={props.post}
        onClose={handleCloseViewer}
        open={openViewer}
      />
      <UploadDialog
        user={props.user.id}
        open={openContentEdit}
        video={props.post.id}
        onClose={handleCloseContentEdit}
      />
    </Card>
  );
}

ContentCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    Thumbnail: PropTypes.string.isRequired,
    Title: PropTypes.string,
    owner: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    FirstName: PropTypes.string.isRequired,
    LastName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
  UserImage: PropTypes.string,
  favorite: PropTypes.object,
  onCloseEditor: PropTypes.func,
  favoriteCallback: PropTypes.func.isRequired,
  showTrainer: PropTypes.bool,
};

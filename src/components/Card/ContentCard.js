import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Card, CardMedia, Typography } from "@material-ui/core";
import { FavoriteBorder } from "@material-ui/icons";

import { API, graphqlOperation, Storage } from "aws-amplify";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import UserAvatar from "../UserAvatar/UserAvatar";
import Button from "@material-ui/core/Button";
import ViewerDialog from "../../views/ContentViewer/ViewerDialog";
import ImageButton from "../CustomButtons/ImageButton";
import UploadDialog from "../../views/ContentUpload/UploadDialog";
import { deleteVideo } from "../../utilities/VideoTools";
import empty from "assets/img/empty.jpg";
import { deleteUserContent } from "../../graphql/mutations";
import CustomDialog from "../Dialog/CustomDialog";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";

export default function ContentCard(props) {
  const [img, setImg] = useState(empty);
  const [liked, setLiked] = useState(false);
  const [openViewer, setOpenViewer] = React.useState(false);
  const [openContentEdit, setOpenContentEdit] = React.useState(false);
  const [openDeletionDialog, setDeletionDialog] = React.useState(false);

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

  const handleOpenDeletion = () => {
    setDeletionDialog(true);
  };

  const handleCloseDeletion = () => {
    setDeletionDialog(false);
  };

  const handleContentDelete = () => {
    deleteVideo(props.post.ContentName, props.post.Thumbnail).then(() => {
      // delete content from database
      API.graphql(
        graphqlOperation(deleteUserContent, {
          input: { id: props.post.id },
        })
      ).then(() => {
        if (liked) {
          props.favoriteCallback(props.favorite, props.post.id);
        }
        handleCloseDeletion();
        props.onCloseEditor();
      });
    });
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

  const headerCol = props.favoriteCallback ? 9 : 12;
  const footerCol = props.post.owner === props.trainer.id ? 4 : 12;
  return (
    <Card>
      <GridContainer>
        <GridItem xs={headerCol}>
          <Typography variant="h3">{props.post.Description}</Typography>
        </GridItem>
        <GridItem xs={3}>
          {props.favoriteCallback && (
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
          )}
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
        {props.showTrainer && (
          <>
            <GridItem xs={6}>
              <UserAvatar UserImage={props.UserImage} />
            </GridItem>
            <GridItem xs={6}>
              <Typography variant="body2">
                {props.trainer.FirstName + " " + props.trainer.LastName}
              </Typography>
            </GridItem>
          </>
        )}
        <GridItem xs={footerCol}>
          <Typography variant="body2">
            {new Date(props.post.createdAt).toDateString()}
          </Typography>
        </GridItem>
        {props.post.owner === props.trainer.id && (
          <>
            <GridItem xs={4}>
              <Button onClick={handleOpenContentEdit}>Edit</Button>
            </GridItem>
            <GridItem xs={4}>
              <Button onClick={handleOpenDeletion}>Delete</Button>
            </GridItem>
          </>
        )}
      </GridContainer>
      <ViewerDialog
        post={props.post}
        onClose={handleCloseViewer}
        open={openViewer}
      />
      <CustomDialog
        open={openDeletionDialog}
        title="Video Deletion Alert"
        text="The video will be completely delete and you may not be able to recover it,
          do you still want to delete it?"
        onClose={handleCloseDeletion}
        onClickYes={handleContentDelete}
        onClickNo={handleCloseDeletion}
      />
      <UploadDialog
        user={props.trainer.id}
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
    Thumbnail: PropTypes.string,
    ContentName: PropTypes.string,
    Title: PropTypes.string,
    owner: PropTypes.string.isRequired,
  }),
  trainer: PropTypes.shape({
    FirstName: PropTypes.string,
    LastName: PropTypes.string,
    id: PropTypes.string,
  }),
  UserImage: PropTypes.string,
  favorite: PropTypes.object,
  onCloseEditor: PropTypes.func,
  favoriteCallback: PropTypes.func,
  showTrainer: PropTypes.bool,
};

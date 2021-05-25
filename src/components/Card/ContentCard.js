import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { CardMedia, Typography } from "@material-ui/core";
import { FavoriteBorder, DeleteOutline, Edit } from "@material-ui/icons";

import { API, graphqlOperation, Storage } from "aws-amplify";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ViewerDialog from "../../views/ContentViewer/ViewerDialog";
import ImageButton from "../CustomButtons/ImageButton";
import UploadDialog from "../../views/ContentUpload/UploadDialog";
import { deleteVideo } from "../../utilities/VideoTools";
import empty from "assets/img/empty.jpg";
import { deleteUserContent } from "../../graphql/mutations";
import CustomDialog from "../Dialog/CustomDialog";
import GridContainer from "../Grid/GridContainer.js";
import GridItem from "../Grid/GridItem.js";
import {
  CardContent,
  CardContentIcon,
  CardContentImage,
  CardContentDate,
  CardContentAvatar,
} from "../StyledComponets/StyledComponets";

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

  const headerCol = props.favoriteCallback ? 10 : 12;
  const footerCol = props.trainer.id === props.user.id ? 4 : 12;

  return (
    <CardContent>
      <GridContainer>
        <GridItem xs={headerCol}>
          <Typography variant="h3">{props.post.Description}</Typography>
          {props.post.ContentName ? (
            <ImageButton url={img} onClick={handleOpenViewer} width="100%" />
          ) : (
            <CardContentImage>
              <CardMedia
                style={{ height: "150px" }}
                image={img}
                title={props.post.Title}
              />
            </CardContentImage>
          )}
        </GridItem>
        <GridItem xs={2}>
          {props.favoriteCallback && (
            <CardContentIcon
              aria-label="favorite this post"
              color="primary"
              onClick={() => {
                setLiked(!liked);
                props.favoriteCallback(props.favorite, props.post.id);
              }}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorder />}
            </CardContentIcon>
          )}
          {props.onCloseEditor && props.trainer.id === props.user.id && (
            <>
              <CardContentIcon
                aria-label="delete this post"
                color="primary"
                onClick={handleOpenDeletion}
              >
                <DeleteOutline />
              </CardContentIcon>
              <CardContentIcon
                aria-label="edit this post"
                color="primary"
                onClick={handleOpenContentEdit}
              >
                <Edit />
              </CardContentIcon>
            </>
          )}
        </GridItem>
        {props.showTrainer && (
          <>
            <GridItem xs={8}>
              <CardContentAvatar UserImage={props.trainer.UserImage} />
            </GridItem>
            {/* <GridItem xs={6}>
              <Typography variant="body2">
                {props.trainer.FirstName + " " + props.trainer.LastName}
              </Typography>
            </GridItem> */}
          </>
        )}
        <GridItem xs={footerCol}>
          <CardContentDate>
            {new Date(props.post.createdAt).toLocaleDateString()}
          </CardContentDate>
        </GridItem>
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
        isVerified={true}
      />
    </CardContent>
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
    UserImage: PropTypes.string,
  }),
  user: PropTypes.shape({ id: PropTypes.string }),
  favorite: PropTypes.object,
  onCloseEditor: PropTypes.func,
  favoriteCallback: PropTypes.func,
  showTrainer: PropTypes.bool,
};

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardMedia, Grid, Typography } from "@material-ui/core";
import { Storage } from "aws-amplify";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { FavoriteBorder } from "@material-ui/icons";
import ViewerDialog from "../../views/ContentViewer/ViewerDialog";
import ImageButton from "../CustomButtons/ImageButton";
import UploadDialog from "../../views/ContentUpload/UploadDialog";
import {
  GridContainer,
  CardStyled,
} from "../StyledComponents/StyledComponents";

import empty from "assets/img/empty.jpg";

export default function WorkoutCard(props) {
  const [img, setImg] = useState(empty);
  const [liked, setLiked] = useState(true);
  const [segments, setSegments] = useState([]);
  const [openViewer, setOpenViewer] = React.useState(false);
  const [openContentEdit, setOpenContentEdit] = React.useState(false);
  var times = 0;

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
    if (props.segments) {
      const segs = JSON.parse(props.segments);
      setSegments(segs);
    }
    if (props.post.Thumbnail) {
      Storage.get(props.post.Thumbnail).then((url) => {
        setImg(url);
      });
    }
  }, [props.post.Thumbnail, props.segments]);

  //Calculate the total time of the segments
  for (var i = 0; i < segments.length; i++) {
    times += parseInt(segments[i].Timestamp);
  }

  return (
    <CardStyled>
      <GridContainer direction="row">
        <Grid item container xs={12} sm={4} direction="column">
          <Grid item xs>
            <Typography variant="h3">{props.post.Title}</Typography>
            <Typography variant="body2">{times} mins</Typography>
          </Grid>
          {props.favoriteCallback && (
            <Grid item>
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
          )}
        </Grid>
        <GridContainer item xs={12} sm={8}>
          {props.post.ContentName ? (
            <ImageButton
              url={img}
              width="100%"
              height="150px"
              onClick={handleOpenViewer}
            />
          ) : (
            <Card>
              <CardMedia
                style={{ height: "150px", width: "250px" }}
                image={img}
                title={props.post.Title}
              />
            </Card>
          )}
        </GridContainer>
      </GridContainer>
      <ViewerDialog
        open={openViewer}
        onClose={handleCloseViewer}
        post={props.post}
      />
      {props.trainer && (
        <UploadDialog
          user={props.trainer.id}
          open={openContentEdit}
          video={props.post.id}
          onClose={handleCloseContentEdit}
          isVerified={true}
        />
      )}
    </CardStyled>
  );
}

WorkoutCard.propTypes = {
  post: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    Thumbnail: PropTypes.string,
    owner: PropTypes.string.isRequired,
    ContentName: PropTypes.string,
  }),
  segments: PropTypes.string,
  trainer: PropTypes.shape({
    id: PropTypes.string,
  }),
  favorite: PropTypes.object,
  onCloseEditor: PropTypes.func,
  favoriteCallback: PropTypes.func,
};

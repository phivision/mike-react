import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Grid, Typography, ListItem } from "@material-ui/core";

import { Storage } from "aws-amplify";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { FavoriteBorder } from "@material-ui/icons";

import ViewerDialog from "../../views/ContentViewer/ViewerDialog";
import ImageButton from "../CustomButtons/ImageButton";
import UploadDialog from "../../views/ContentUpload/UploadDialog";
import {
  // GridItem,
  GridContainer,
  CardStyled,
} from "../../components/StyledComponets/StyledComponets";

import empty from "assets/img/empty.jpg";

const SegmentCard = ({ ...props }) => {
  return (
    <>
      <ListItem>
        <GridContainer>
          <Grid item>
            <Typography variant="h3">{props.segment.Name}</Typography>
            <Typography variant="body2">{props.segment.Timestamp}</Typography>
          </Grid>
          <Grid item>
            {props.segment.Sets && props.segment.Reps && (
              <Typography variant="body2">
                {props.segment.Sets +
                  " Sets of " +
                  props.segment.Reps +
                  " reps"}
              </Typography>
            )}
            {props.segment.RPE && (
              <Typography variant="body2">
                {"Rate of Perceived Exhaustion: " + props.segment.RPE}
              </Typography>
            )}
          </Grid>
        </GridContainer>
      </ListItem>
      <Divider />
    </>
  );
};

SegmentCard.propTypes = {
  segment: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Timestamp: PropTypes.string.isRequired,
    Sets: PropTypes.string.isRequired,
    Reps: PropTypes.string.isRequired,
    RPE: PropTypes.string.isRequired,
  }),
};

export default function WorkoutCard(props) {
  const [img, setImg] = useState(empty);
  const [liked, setLiked] = useState(true);
  const [segments, setSegments] = useState([]);
  const [openViewer, setOpenViewer] = React.useState(false);
  const [openContentEdit, setOpenContentEdit] = React.useState(false);

  // const handleOpenContentEdit = () => {
  //   setOpenContentEdit(true);
  // };

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

  return (
    <CardStyled>
      <GridContainer direction="row">
        <Grid item container xs={4} direction="column">
          <Grid item xs={9}>
            <Typography variant="h3">{props.post.Title}</Typography>
          </Grid>
          {/* {props.post.owner === props.user.id && (
            <Grid item xs>
              <Button onClick={handleOpenContentEdit}>Edit</Button>
            </Grid>
          )} */}
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
          <List>
            {segments &&
              segments.map((s, idx) => {
                return <SegmentCard segment={s} key={idx} />;
              })}
          </List>
        </Grid>
        <GridContainer item xs={8}>
          {img && (
            <ImageButton url={img} width="100%" onClick={handleOpenViewer} />
          )}
        </GridContainer>
      </GridContainer>
      <ViewerDialog
        open={openViewer}
        onClose={handleCloseViewer}
        post={props.post}
      />
      <UploadDialog
        user={props.user.id}
        open={openContentEdit}
        video={props.post.id}
        onClose={handleCloseContentEdit}
      />
    </CardStyled>
  );
}

WorkoutCard.propTypes = {
  post: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    Thumbnail: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
  }),
  segments: PropTypes.string,
  user: PropTypes.shape({
    FirstName: PropTypes.string.isRequired,
    LastName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
  favorite: PropTypes.object,
  onCloseEditor: PropTypes.func,
  favoriteCallback: PropTypes.func.isRequired,
};

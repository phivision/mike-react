import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Card, Grid, Typography, ListItem } from "@material-ui/core";

import { Storage } from "aws-amplify";
import CardActionArea from "@material-ui/core/CardActionArea";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { FavoriteBorder } from "@material-ui/icons";

import ViewerDialog from "../../views/ContentViewer/ViewerDialog";
import ImageButton from "../CustomButtons/ImageButton";

const SegmentCard = ({ ...props }) => {
  return (
    <>
      <ListItem>
        <Grid container>
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
        </Grid>
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

export default function WorkoutCard({ ...props }) {
  const [img, setImg] = useState();
  const [liked, setLiked] = useState(true);
  const [segments, setSegments] = useState([]);
  const [openViewer, setOpenViewer] = React.useState(false);

  const handleOpenViewer = () => {
    setOpenViewer(true);
  };

  const handleCloseViewer = () => {
    setOpenViewer(false);
  };

  console.log(props);

  useEffect(() => {
    if (props.segments) {
      const segs = JSON.parse(props.segments);
      setSegments(segs);
    }
    Storage.get(props.post.Thumbnail).then((url) => {
      setImg(url);
    });
  }, [props.post.Thumbnail, props.segments]);

  return (
    <Card>
      <Grid container direction="column">
        <CardActionArea onClick={() => props.clickCallback(props.post.id)}>
          <Grid item container xs>
            {img && (
              <ImageButton url={img} width="50%" onClick={handleOpenViewer} />
            )}
          </Grid>
        </CardActionArea>
        <Grid item container xs>
          <Grid item xs>
            <Typography variant="h3">{props.post.Title}</Typography>
          </Grid>
          {props.post.owner === props.user.id && (
            <Grid item xs>
              <Button
                onClick={() => {
                  props.editCallback(props.post.id);
                }}
              >
                Edit
              </Button>
            </Grid>
          )}
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
      </Grid>
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
    owner: PropTypes.string.isRequired,
  }),
  segments: PropTypes.string,
  user: PropTypes.shape({
    FirstName: PropTypes.string.isRequired,
    LastName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
  favorite: PropTypes.object,
  favoriteCallback: PropTypes.func.isRequired,
  clickCallback: PropTypes.func,
  editCallback: PropTypes.func,
};

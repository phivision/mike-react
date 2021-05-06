import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Card, Grid, Typography, CardMedia, ListItem } from "@material-ui/core";

import { Storage } from "aws-amplify";
import CardActionArea from "@material-ui/core/CardActionArea";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";

const SegmentCard = ({ ...props }) => {
  return (
    <>
      <ListItem>
        <Grid container>
          <Grid item>
            <Typography variant="H3">{props.segment.Name}</Typography>
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
  const [segments, setSegments] = useState();

  useEffect(() => {
    console.log(props);
    if (props.segments) {
      const segs = JSON.parse(props.segments);
      setSegments(segs);
    }
  }, [props.segments]);

  useEffect(() => {
    Storage.get(props.post.Thumbnail).then((url) => {
      setImg(url);
    });
  }, [props.post.Thumbnail]);

  return (
    <Card>
      <CardActionArea onClick={props.clickCallback}>
        <Grid container direction="column">
          <Grid item container xs>
            <CardMedia
              image={img}
              style={{ height: "250px", width: "250px", paddingTop: "2%" }}
              title="Content Thumbnail"
            />
          </Grid>
          <Grid item container xs>
            <Grid item xs>
              <Typography variant="h3">{props.post.Title}</Typography>
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
      </CardActionArea>
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
  }),
  segments: PropTypes.object,
  user: PropTypes.shape({
    FirstName: PropTypes.string.isRequired,
    LastName: PropTypes.string.isRequired,
  }),
  favorite: PropTypes.object,
  favoriteCallback: PropTypes.func.isRequired,
  clickCallback: PropTypes.func,
};

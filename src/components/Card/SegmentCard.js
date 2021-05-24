import { Grid, ListItem, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import PropTypes from "prop-types";
import React from "react";

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

export { SegmentCard };

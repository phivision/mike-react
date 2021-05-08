import { Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

const TrainerMetrics = ({ ...props }) => {
  return (
    <Grid container>
      <Grid item container direction="column" xs={2}>
        <Grid item>
          <Typography variant="h6">Weight</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h3" style={{ display: "inline-block" }}>
            {props.weight}
          </Typography>
          <Typography variant="body2" style={{ display: "inline-block" }}>
            lb
          </Typography>
        </Grid>
      </Grid>
      <Grid item container direction="column" xs={2}>
        <Grid item>
          <Typography variant="h6">Height</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h3" style={{ display: "inline-block" }}>
            {Math.floor(props.height / 12) + "' " + (props.height % 12) + '"'}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container direction="column" xs={2}>
        <Grid item>
          <Typography variant="h6">Age</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h3" style={{ display: "inline-block" }}>
            {new Date().getFullYear() - new Date(props.birthday).getFullYear()}
          </Typography>
          <Typography variant="body2" style={{ display: "inline-block" }}>
            yr
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

TrainerMetrics.propTypes = {
  weight: PropTypes.number,
  height: PropTypes.number,
  birthday: PropTypes.string,
};

export default TrainerMetrics;

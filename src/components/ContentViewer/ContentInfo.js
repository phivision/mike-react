import React from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";

const Segment = ({ segment }) => {
  return (
    <GridContainer>
      <GridItem item xs={4}>
        <Typography variant="h6">{segment.Name}</Typography>
      </GridItem>
      <GridItem item xs={8}>
        <Typography variant="h6">
          {segment.Sets} sets of {segment.Reps} reps
        </Typography>
      </GridItem>
      <GridItem item xs={4}>
        <Typography variant="h6">{segment.Timestamp} min</Typography>
      </GridItem>
      <GridItem item xs={8}>
        <Typography variant="h6">
          Rate of Perceived Exhaustion: {segment.RPE}
        </Typography>
      </GridItem>
    </GridContainer>
  );
};

Segment.propTypes = {
  segment: PropTypes.shape({
    Name: PropTypes.string,
    Timestamp: PropTypes.string,
    Sets: PropTypes.string,
    Reps: PropTypes.string,
    RPE: PropTypes.string,
  }),
};

export default function ContentInfo({ title, desc, segments }) {
  const segment_list = JSON.parse(segments);
  return (
    <Container maxWidth="sm">
      <Typography variant="h1">{title}</Typography>
      <Typography>{desc}</Typography>
      <Typography variant="h3">Sections</Typography>
      {segment_list.map((segment, key) => {
        return <Segment segment={segment} key={key} />;
      })}
    </Container>
  );
}

ContentInfo.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  segments: PropTypes.string.isRequired,
};

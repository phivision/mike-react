import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {
  GridContainer,
  GridItem,
  DividerLine,
  BlackTitle,
  ContainBox,
  Attribute,
} from "components/StyledComponents/StyledComponents";

const Segment = ({ segment }) => {
  return (
    <GridContainer direction="row" justify="space-between" alignItems="center">
      <GridItem xs>
        <BlackTitle>{segment.Name}</BlackTitle>
      </GridItem>
      <GridItem xs>
        <Typography variant="body2">{segment.Timestamp}</Typography>
      </GridItem>
      <DividerLine />
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
    <ContainBox maxWidth="sm">
      <GridItem>
        <Attribute>{title}</Attribute>
        <Typography variant="body1">{desc}</Typography>
      </GridItem>
      <GridItem>
        <BlackTitle>Sections</BlackTitle>
        {segment_list.map((segment, key) => {
          return <Segment segment={segment} key={key} />;
        })}
      </GridItem>
    </ContainBox>
  );
}

ContentInfo.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  segments: PropTypes.string.isRequired,
};

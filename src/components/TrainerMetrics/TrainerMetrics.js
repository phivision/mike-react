import PropTypes from "prop-types";
import React from "react";
import {
  GridContainer,
  GridItem,
  AttriTitle,
  Attribute,
  Unit,
} from "../StyledComponets/StyledComponets";

const TrainerMetrics = ({ ...props }) => {
  return (
    <GridContainer>
      <GridContainer item direction="column" xs={4}>
        <GridItem>
          <AttriTitle>Weight</AttriTitle>
        </GridItem>
        <GridItem>
          <Attribute>{props.weight}</Attribute>
          <Unit>lb</Unit>
        </GridItem>
      </GridContainer>
      <GridContainer item direction="column" xs={4}>
        <GridItem>
          <AttriTitle>Age</AttriTitle>
        </GridItem>
        <GridItem>
          <Attribute>
            {new Date().getFullYear() - new Date(props.birthday).getFullYear()}
          </Attribute>
          <Unit>yr</Unit>
        </GridItem>
      </GridContainer>
      <GridContainer item direction="column" xs={4}>
        <GridItem>
          <AttriTitle>Height</AttriTitle>
        </GridItem>
        <GridItem>
          <Attribute>
            {Math.floor(props.height / 12) + "' " + (props.height % 12) + '"'}
          </Attribute>
        </GridItem>
      </GridContainer>
    </GridContainer>
  );
};

TrainerMetrics.propTypes = {
  weight: PropTypes.number,
  height: PropTypes.number,
  birthday: PropTypes.string,
};

export default TrainerMetrics;

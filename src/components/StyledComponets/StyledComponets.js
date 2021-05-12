import styled from "styled-components";
import { Grid, Card, Typography } from "@material-ui/core";

export const GridContainer = styled(Grid).attrs({
  container: true,
})`
  padding: 10px;
`;

export const GridItem = styled(Grid).attrs({
  item: true,
})`
  padding: 5px;
  display: table-cell;
`;

export const CardStyled = styled(Card)`
  border-radius: 20px;
  margin: 10px 0;
`;

export const CardIcon = styled.img`
  max-height: 100%;
  max-width: 100%;
  border-radius: 30px;
  display: block;
  margin: auto;
`;

export const H3title = styled(Typography).attrs({
  variant: "h3",
})`
  font-size: 26px;
`;

export const Text = styled(Typography).attrs({
  variant: "body1",
})`
  font-size: 16px;
`;

export const AttriTitle = styled(Typography).attrs({
  variant: "h6",
})`
  display: inline-block;
  font-weight: 800;
`;

export const Attribute = styled(Typography).attrs({
  variant: "h3",
})`
  display: inline-block;
  font-weight: 700;
`;

export const Unit = styled(Typography).attrs({
  variant: "body2",
})`
  display: inline-block;
`;

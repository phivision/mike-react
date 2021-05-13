import styled from "styled-components";
import {
  Grid,
  Card,
  Typography,
  Button,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { primaryColor } from "assets/jss/material-dashboard-react.js";
import { Link } from "react-router-dom";

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

export const SearchButton = styled(SearchBar)`
  &&& {
    margin-right: 20px;
    background-color: #eaeef1;
    box-shadow: none;
    border-radius: 20px;
    min-width: 300px;
    .MuiIconButton-label {
      color: ${primaryColor[0]};
    }
  }
`;

export const CustomButton = styled(Button).attrs({
  variant: "contained",
  color: "primary",
})`
  border-radius: 20px;
  font-weight: 700;
`;

export const AppHeader = styled(AppBar)`
  position: static;
`;

export const Bars = styled(Toolbar)`
  flexwrap: wrap;
`;

export const LogoLink = styled(Link)`
  flex: 1;
`;

export const Nav = styled(Link)`
  margin: 10px;
`;
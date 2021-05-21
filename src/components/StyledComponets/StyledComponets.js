import styled from "styled-components";
import {
  Grid,
  Card,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Input,
  Divider,
  Container,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import {
  primaryColor,
  contentColor,
} from "assets/jss/material-dashboard-react.js";
import { Link } from "react-router-dom";
import Person from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import UserAvatar from "../UserAvatar/UserAvatar";
import TableContainer from "@material-ui/core/TableContainer";

export const ContainBox = styled(Container).attrs({
  disableGutters: true,
})`
  padding: 10px;
`;

export const GridContainer = styled(Grid).attrs({
  container: true,
})`
  padding: 10px;
`;

export const GridItem = styled(Grid).attrs({
  item: true,
})`
  padding: 5px;
  display: block;
`;

export const CardStyled = styled(Card)`
  border-radius: 20px;
  margin: 10px 0;
  box-shadow: 0 5px 20px 5px #eff1fa;
  max-width: 70%;
`;

export const CardIcon = styled.img`
  max-height: 100%;
  max-width: 100%;
  border-radius: 30px;
  display: block;
  margin: auto;
`;

export const BlackTitle = styled(Typography).attrs({
  variant: "h6",
})`
  display: inline-block;
  font-weight: 700;
  color: black !important;
  margin: 5px 0;
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
  margin: 5px 0;
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
  border-radius: 10px;
  font-weight: 600;
  margin: 5px;
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

export const CustomIcon = styled(IconButton).attrs({
  size: "small",
})`
  width: 36px;
  height: fit-content;
  margin: 5px;
  padding: 0;
  .MuiIconButton-label {
    display: inline-block;
  }
`;

export const IconStyle = styled(IconButton).attrs({
  size: "small",
})`
  padding: 0;
  height: fit-content;
  .MuiIconButton-label {
    display: inline-block;
  }
`;

export const SetIcon = styled(SettingsIcon).attrs({
  fontSize: "large",
})`
  font-size: 30px;
`;

export const UserIcon = styled(Person).attrs({
  fontSize: "large",
})`
  font-size: 30px;
`;

export const VideoLibrary = styled(VideoLibraryIcon).attrs({
  fontSize: "large",
  color: "action",
})`
  font-size: 30px;
`;

export const StyledContent = styled.div`
  border-radius: 30px 30px 0 0;
  margin-top: -20px;
  background-color: ${contentColor};
`;

export const ProfileBox = styled.div`
  width: 60%;
  margin: 0 auto;
  position: relative;
  top: -5%;
  padding: 10px;
`;

export const UserFeedBanner = styled(Grid).attrs({
  item: true,
})`
  height: 100px;
  background-image: url(${(props) => props["aria-multiselectable"]});
`;

export const InputField = styled(TextField).attrs({
  multiline: true,
})`
  margin: 10px;
`;

export const TextStyle = styled(Typography)`
  display: inline-block;
  margin: 2px;
`;

export const InputButton = styled(Input).attrs({
  disableUnderline: true,
})`
  margin: 5px;
`;

export const DividerLine = styled(Divider).attrs({
  variant: "fullWidth",
})`
  width: 100%;
`;

export const FlexContain = styled(Container).attrs({
  maxWidth: false,
  disableGutters: true,
})`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const CardContent = styled(Card)`
  padding: 20px;
  margin: 20px;
  border-radius: 20px;
`;

export const CardContentIcon = styled(IconButton)`
  padding: 5px;
  margin-left: 5px;
`;

export const CardContentImage = styled(Card)`
  margin: 10px 0;
  border-radius: 15px;
`;

export const CardContentDate = styled(Typography).attrs({
  variant: "body2",
})`
  text-align: right;
`;

export const CardContentAvatar = styled(UserAvatar)`
  margin: 10px 0 -40px -40px;
  width: 30%;
  border-radius: 10px;
`;

export const SettingTableContainer = styled(TableContainer)`
  margin: 0 auto;
  margin-top: 60px;
  width: 80%;
  background-color: #f4f6fa;
  border: none;
  margin-bottom: 30px;
`;

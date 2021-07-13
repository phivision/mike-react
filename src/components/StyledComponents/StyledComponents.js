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
  DialogContent,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { Link } from "react-router-dom";
import Person from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import UserAvatar from "../UserAvatar/UserAvatar";
import Container from "@material-ui/core/Container";
import MoreIcon from "@material-ui/icons/MoreVert";
import { MobileVersion, uptoMobileWidth } from "variables/mediaQueries";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { ExternalLink } from "../Link/ExternalLink";
import Box from "@material-ui/core/Box";

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
  padding: 20px;
`;

export const CardStyled = styled(Card)`
  border-radius: 20px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 5px 20px 5px #eff1fa;
  max-width: 80%;
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
  color: black !important;
  display: inline-block;
  text-decoration: none;
  text-transform: none;
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
    margin: 10px;
    background-color: #eaeef1;
    box-shadow: none;
    border-radius: 10px;
    min-width: 80px;
    //.MuiIconButton-label {
    //  color: theme.palette.primary.main;
    //}
  }
`;

//Variant + color should be noted per instance, NOT in styled components
export const CustomButton = styled(Button)`
  text-transform: none;
  border-radius: 10px;
  font-weight: 600;
  margin: 5px;
  min-width: 120px;
`;

export const AppHeader = styled(AppBar)`
  position: static;
`;

export const Bars = styled(Toolbar)`
  @media only screen and ${MobileVersion} {
    padding-left: 8px;
    padding-right: 8px;
  }
`;

export const LogoLink = styled(Link)`
  flex: 1;
`;

export const Nav = styled(Link)`
  margin: 0;
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
  @media only screen and ${MobileVersion} {
    width: 25px;
    margin: 10px;
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

export const IconMore = styled(MoreIcon).attrs({
  fontSize: "large",
})`
  font-size: 30px;
`;

export const UploadIcon = styled(CloudUploadIcon).attrs({
  fontSize: "large",
})`
  font-size: 30px;
`;

export const ProfileBox = styled.div`
  width: 100%;
  padding: 0 20px;
  margin: 0 auto;
  position: relative;
  top: -5%;
`;

export const UserFeedBanner = styled(Grid).attrs({
  item: true,
})`
  height: 100px;
  background-image: url(${(props) => props.url});
`;

export const InputField = styled(TextField).attrs({
  variant: "outlined",
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
  margin: 0 5px;
`;

export const FlexContain = styled(Container).attrs({
  maxWidth: false,
  disableGutters: true,
})`
  display: flex;
  position: relative;
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

export const CustomContainer = styled(Container)`
  margin: 0 auto;
  margin-top: 30px;
  border: none;
  margin-bottom: 30px;
  padding-left: 50px;
  padding-right: 50px;
`;

export const CustomBanner = styled(Container).attrs({ maxWidth: false })`
  background-color: white;
  margin: 0;
  border: none;
`;

export const LogoImage = styled.img`
  width: auto;
  max-width: 200px;
  @media only screen and ${uptoMobileWidth} {
    width: 80px;
  }
`;

export const CustomFooter = styled.footer`
  position: absolute;
  width: 100%;
  padding-top: 30px;
  padding-left: 72px;
  padding-right: 72px;
  bottom: 0;
`;

export const DialogBody = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
`;

export const TextA = styled.a`
  cursor: pointer;
  font-size: ${(props) => props.size};
  :hover {
    font-weight: bold;
  }
`;

export const BannerText = styled(Box)`
  min-width: 500px;
  padding-top: 0;
  padding-bottom: 60px;
`;

export const BannerImage = styled.img`
  width: 100%;
`;

export const GridTitleFlex = styled(Grid).attrs({
  item: true,
  container: true,
})`
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TextLink = styled(Link)`
  padding: 10px;
  text-decoration: none;
`;

export const TextExtLink = styled(ExternalLink)`
  padding: 10px;
  text-decoration: none;
`;

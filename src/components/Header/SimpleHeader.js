import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  CustomButton,
  LogoImage,
  LogoLink,
} from "../StyledComponents/StyledComponents";
import logo from "../../assets/logo.jpg";
import { AppBar, Toolbar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const Header = () => {
  const useStyles = makeStyles((theme) => ({
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "block",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
  }));

  const classes = useStyles();

  const Logo = () => (
    <LogoLink to="/">
      <LogoImage src={logo} alt="logo" />
    </LogoLink>
  );

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Logo />
        <IconButton className={classes.sectionMobile} color="primary">
          <MenuIcon />
        </IconButton>
        <div className={classes.sectionDesktop}>
          <CustomButton>I&apos;m a follower</CustomButton>
          <CustomButton color="secondary" variant="contained">
            Create on Motion
          </CustomButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

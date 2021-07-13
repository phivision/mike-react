import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  CustomButton,
  LogoImage,
  LogoLink,
} from "../StyledComponents/StyledComponents";
import logo from "../../assets/logo.jpg";
import { AppBar, SwipeableDrawer, Toolbar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";

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

  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = useStyles();
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const Logo = () => (
    <LogoLink to="/">
      <LogoImage src={logo} alt="logo" />
    </LogoLink>
  );

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Logo />
        <React.Fragment key="anchor">
          <IconButton
            className={classes.sectionMobile}
            onClick={() => setOpenDrawer(true)}
            color="primary"
          >
            <MenuIcon />
          </IconButton>
          <SwipeableDrawer
            anchor="top"
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            onOpen={() => setOpenDrawer(true)}
          >
            <Box m={2}>
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <CustomButton>I&apos;m a follower</CustomButton>
                </Grid>
                <Grid item>
                  <CustomButton color="secondary" variant="contained">
                    Create on Motion
                  </CustomButton>
                </Grid>
                <Grid item>
                  <IconButton>
                    <CloseIcon color="theme.primary.dark" />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </SwipeableDrawer>
        </React.Fragment>
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

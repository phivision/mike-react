import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CustomButton, TextStyle } from "../StyledComponents/StyledComponents";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { AppBar, SwipeableDrawer, Toolbar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";

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
  logo: {
    width: "100%",
    height: "auto",
    maxWidth: "100px",
  },
  logoLink: {
    flex: "1",
  },
}));

const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = useStyles();
  let history = useHistory();
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const Logo = () => (
    <Link to="/" className={classes.logoLink}>
      <Grid container alignItems="center" direction="row">
        <Grid item xs={1}>
          <img src={logo} className={classes.logo} />
        </Grid>
        <Grid item>
          <TextStyle variant="h2">Motion</TextStyle>
        </Grid>
      </Grid>
    </Link>
  );

  const redirect = (route) => {
    setOpenDrawer(false);
    history.push(route);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Logo />
        <>
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
                  <CustomButton onClick={() => redirect("/creator")}>
                    I&apos;m a creator
                  </CustomButton>
                </Grid>
                <Grid item>
                  <CustomButton onClick={() => redirect("/follower")}>
                    I&apos;m a follower
                  </CustomButton>
                </Grid>
                <Grid item>
                  <CustomButton
                    onClick={() => redirect("/onboarding")}
                    color="secondary"
                    variant="contained"
                  >
                    Create on Motion
                  </CustomButton>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => setOpenDrawer(false)}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </SwipeableDrawer>
        </>
        <div className={classes.sectionDesktop}>
          <CustomButton onClick={() => history.push("/creator")}>
            I&apos;m a creator
          </CustomButton>
          <CustomButton onClick={() => history.push("/follower")}>
            I&apos;m a follower
          </CustomButton>
          <CustomButton
            onClick={() => history.push("/onboarding")}
            color="secondary"
            variant="contained"
          >
            Create on Motion
          </CustomButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

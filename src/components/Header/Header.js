import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Icon, Typography } from "@material-ui/core";
import logo from "../../assets/logo.jpg";
import PropTypes from "prop-types";
import { userRoles } from "../../variables/userRoles";
import {
  AppHeader,
  CustomButton,
  SearchButton,
  Bars,
  LogoLink,
  Nav,
  AttriTitle,
  CustomIcon,
  SetIcon,
  UserIcon,
  IconMore,
  LogoImage,
  UploadIcon,
} from "../StyledComponents/StyledComponents";
import { Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

export default function Header(props) {
  const [userRole, setUserRole] = useState(userRoles.UNKNOWN);

  useEffect(() => {
    setUserRole(props.user.role);
  }, [props.user]);

  const handleOpenContentUpload = props.onContentUpload;

  let history = useHistory();
  const [query, setQuery] = useState("");
  const [mobileMore, setMobileMore] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMore);
  const classes = useStyles();

  const handleMobileMenuClose = () => {
    setMobileMore(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMore(event.currentTarget);
  };

  const SignUpLink = () => {
    return (
      <>
        {isMobileMenuOpen ? (
          <MenuItem>
            <Nav to="/signup/trainer">
              <AttriTitle>Create on Motion</AttriTitle>
            </Nav>
          </MenuItem>
        ) : (
          <Nav to="/signup/trainer">
            <CustomButton variant="contained">Create on Motion</CustomButton>
          </Nav>
        )}
      </>
    );
  };

  const SignInLink = () => {
    return (
      <>
        {isMobileMenuOpen ? (
          <MenuItem>
            <Nav to="/signin" variant="h3">
              <AttriTitle>Log In</AttriTitle>
            </Nav>
          </MenuItem>
        ) : (
          <Nav to="/signin" variant="h3">
            <AttriTitle>Log In</AttriTitle>
          </Nav>
        )}
      </>
    );
  };

  const ContentUploadButton = () => {
    return (
      <>
        {isMobileMenuOpen ? (
          <MenuItem>
            <CustomIcon onClick={handleOpenContentUpload}>
              <UploadIcon color="secondary" />
            </CustomIcon>
            <Typography color="secondary" style={{ display: "inline-block" }}>
              Upload Content
            </Typography>
          </MenuItem>
        ) : (
          <CustomButton variant="contained" onClick={handleOpenContentUpload}>
            Upload Content
          </CustomButton>
        )}
      </>
    );
  };

  const Logo = () => {
    return userRole === userRoles.UNKNOWN ? (
      <LogoLink to="/">
        <LogoImage src={logo} alt="logo" />
      </LogoLink>
    ) : (
      <LogoLink to="/feed">
        <LogoImage src={logo} alt="logo" />
      </LogoLink>
    );
  };

  const UserButton = () => {
    const location = useLocation();
    let color = location.pathname === "/feed" ? "primary" : "secondary";
    return (
      <>
        {isMobileMenuOpen ? (
          <MenuItem>
            <Nav to={"/feed"} key={"User Profile"}>
              <CustomIcon color={color}>
                <UserIcon />
              </CustomIcon>
              <Typography color={color} style={{ display: "inline-block" }}>
                User
              </Typography>
            </Nav>
          </MenuItem>
        ) : (
          <Nav to={"/feed"} key={"User Profile"}>
            <CustomIcon color={color}>
              {typeof UserIcon === "string" ? (
                <Icon> {UserIcon} </Icon>
              ) : (
                <UserIcon />
              )}
            </CustomIcon>
          </Nav>
        )}
      </>
    );
  };

  const SettingButton = () => {
    const location = useLocation();
    let color = location.pathname === "/settings/" ? "primary" : "secondary";
    return (
      <>
        {isMobileMenuOpen ? (
          <MenuItem onClick={() => history.push("/settings/")}>
            <CustomIcon color={color}>
              <SetIcon />
            </CustomIcon>
            <Typography color={color} style={{ display: "inline-block" }}>
              Settings
            </Typography>
          </MenuItem>
        ) : (
          <CustomIcon color={color} onClick={() => history.push("/settings/")}>
            {typeof SetIcon === "string" ? (
              <Icon> {SetIcon} </Icon>
            ) : (
              <SetIcon />
            )}
          </CustomIcon>
        )}
      </>
    );
  };

  const ShowButtonSets = () => {
    return (
      <>
        {userRole === userRoles.TRAINER ? <ContentUploadButton /> : null}
        {userRole === userRoles.STUDENT || userRole === userRoles.TRAINER ? (
          <>
            <UserButton />
            <SettingButton />
          </>
        ) : null}
        {userRole === userRoles.UNKNOWN ? (
          <>
            <SignInLink />
            <SignUpLink />
          </>
        ) : null}
      </>
    );
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMore}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id="mobile-menu"
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <ShowButtonSets />
    </Menu>
  );

  return (
    <AppHeader>
      <Bars>
        <Logo />
        {userRole === userRoles.STUDENT || userRole === userRoles.UNKNOWN ? (
          <SearchButton
            value={query}
            placeholder={"Find a trainer"}
            onChange={(q) => setQuery(q)}
            onRequestSearch={() => history.push("/search/" + query)}
          />
        ) : null}
        <div className={classes.sectionDesktop}>
          <ShowButtonSets />
        </div>
        <CustomIcon
          aria-label="show more"
          aria-controls="mobile-menu"
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          className={classes.sectionMobile}
          color="primary"
        >
          <IconMore />
        </CustomIcon>
        {renderMobileMenu}
      </Bars>
    </AppHeader>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
  onContentUpload: PropTypes.func,
};

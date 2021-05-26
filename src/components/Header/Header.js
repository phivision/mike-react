import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Icon } from "@material-ui/core";
import logo from "../../assets/img/logo.jpg";
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
} from "../StyledComponets/StyledComponets";
import { Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const SignUpLink = () => {
  return (
    <Nav to="/signup/trainer">
      <CustomButton>Coach on Mike</CustomButton>
    </Nav>
  );
};

SignUpLink.propTypes = {
  className: PropTypes.string,
};

const SignInLink = () => {
  return (
    <Nav to="/signin" variant="h3">
      <AttriTitle>Log In</AttriTitle>
    </Nav>
  );
};

const UserButton = () => {
  const location = useLocation();
  let color = location.pathname === "/user" ? "primary" : "secondary";
  return (
    <Nav to={"/user"} key={"User Profile"}>
      <CustomIcon color={color}>
        {typeof UserIcon === "string" ? <Icon>{UserIcon}</Icon> : <UserIcon />}
      </CustomIcon>
    </Nav>
  );
};

UserButton.propTypes = {
  route: PropTypes.shape({
    path: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default function Header(props) {
  let userRole;
  if (props.user && props.user.id) {
    userRole = props.user.role;
  } else {
    userRole = userRoles.UNKNOWN;
  }
  const handleOpenContentUpload = props.onContentUpload;

  let history = useHistory();
  const [query, setQuery] = React.useState("");
  const [mobileMore, setMobileMore] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMore);
  const classes = useStyles();

  const handleMobileMenuClose = () => {
    setMobileMore(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMore(event.currentTarget);
  };

  const ContentUploadButton = () => {
    return (
      <CustomButton onClick={handleOpenContentUpload}>
        Upload Content
      </CustomButton>
    );
  };

  const Logo = () => {
    return props.user.role === userRoles.UNKNOWN ? (
      <LogoLink to="/">
        <LogoImage src={logo} alt="logo" />
      </LogoLink>
    ) : (
      <LogoLink to="/user">
        <LogoImage src={logo} alt="logo" />
      </LogoLink>
    );
  };

  const SettingButton = () => {
    const location = useLocation();
    let color = location.pathname === "/settings/" ? "primary" : "secondary";
    return (
      <CustomIcon color={color} onClick={() => history.push("/settings/")}>
        {typeof SetIcon === "string" ? <Icon>{SetIcon}</Icon> : <SetIcon />}
      </CustomIcon>
    );
  };

  const ShowButtonSets = () => {
    return (
      <div>
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
      </div>
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
      <MenuItem>
        <ShowButtonSets />
      </MenuItem>
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

import React from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button, Icon, IconButton } from "@material-ui/core";
import styles from "assets/jss/material-dashboard-react/components/headerStyle.js";
import styled from "styled-components";
import SearchBar from "material-ui-search-bar";
import logo from "../../assets/img/logo.jpg";
import PropTypes from "prop-types";
import { userRoles } from "../../variables/userRoles";
import { headerRoutes } from "routes";

const useStyles = makeStyles(styles);
const SearchButton = styled(SearchBar)`
  &&& {
    margin-right: 20px;
    background-color: #eaeef1;
    box-shadow: none;
    border-radius: 20px;
    min-width: 300px;
    .MuiIconButton-label {
      color: #5dcbcb;
    }
  }
`;

const SignUpLink = ({ className }) => {
  return (
    <Link to="/home/signup/trainer">
      <Button variant="contained" className={className}>
        Coach on Mike
      </Button>
    </Link>
  );
};

SignUpLink.propTypes = {
  className: PropTypes.string,
};

const SignInLink = () => {
  return (
    <Link to="/home/signin" variant="h3">
      Log In
    </Link>
  );
};

const UserIcon = ({ route }) => {
  return (
    <Link to={route.layout + route.path} key={route.name}>
      {typeof route.icon === "string" ? (
        <Icon>{route.icon}</Icon>
      ) : (
        <route.icon />
      )}
    </Link>
  );
};

UserIcon.propTypes = {
  route: PropTypes.shape({
    layout: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default function Header(props) {
  let userRole;
  if (props.user && props.user.attributes) {
    userRole = props.user.attributes["custom:role"];
  } else {
    userRole = userRoles.UNKNOWN;
  }
  const handleOpenSettings = props.onSettings;

  const classes = useStyles();
  let history = useHistory();
  const [query, setQuery] = React.useState("");

  const ContentUploadButton = () => {
    const route = headerRoutes.videoUpload;
    // temporarily use number 9
    return (
      <Link to={route.layout + route.path} key={route.name}>
        <Button variant="contained" className={classes.buttonStyle}>
          Upload Content
        </Button>
      </Link>
    );
  };

  const Logo = () => {
    return (
      <div className={classes.flex}>
        <Link to="/home/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
    );
  };

  const SettingButton = () => {
    return (
      <IconButton onClick={handleOpenSettings}>
        {typeof headerRoutes.settings.icon === "string" ? (
          <Icon>{headerRoutes.settings.icon}</Icon>
        ) : (
          <headerRoutes.settings.icon />
        )}
      </IconButton>
    );
  };

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <Logo />
        {userRole === userRoles.STUDENT || userRole === userRoles.UNKNOWN ? (
          <SearchButton
            value={query}
            placeholder={"Find a trainer"}
            onChange={(q) => setQuery(q)}
            onRequestSearch={() => history.push("/home/search/" + query)}
            className={classes.searchBar}
          />
        ) : null}
        {userRole === userRoles.TRAINER ? <ContentUploadButton /> : null}
        {userRole === userRoles.STUDENT || userRole === userRoles.TRAINER ? (
          <UserIcon route={headerRoutes.userProfile} />
        ) : null}
        {userRole === userRoles.STUDENT || userRole === userRoles.TRAINER ? (
          <SettingButton />
        ) : null}
        {userRole === userRoles.UNKNOWN ? <SignInLink /> : null}
        {userRole === userRoles.UNKNOWN ? (
          <SignUpLink className={classes.buttonStyle} />
        ) : null}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    attributes: PropTypes.shape({ "custom:role": PropTypes.string }),
  }),
  onSettings: PropTypes.func,
};

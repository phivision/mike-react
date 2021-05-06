import React from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button, Icon } from "@material-ui/core";
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
  className: PropTypes.object,
};

const SignInLink = ({ className }) => {
  return (
    <Link to="/home/signin" color="inherit" className={className}>
      Log In
    </Link>
  );
};

SignInLink.propTypes = {
  className: PropTypes.object,
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

  const classes = useStyles();
  let history = useHistory();
  const [query, setQuery] = React.useState("");
  const Search = () => {
    return (
      <SearchButton
        value={query}
        placeholder={"Find a trainer"}
        onChange={(q) => setQuery(q)}
        onRequestSearch={() => history.push("/home/search/" + query)}
        className={classes.searchBar}
      />
    );
  };

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

  const HeaderBar = ({ role, className }) => {
    let elementArray = [];
    elementArray.push({ component: Logo, props: null });
    if (role === userRoles.STUDENT || role === userRoles.UNKNOWN) {
      elementArray.push({ component: Search, props: null });
    }
    if (role === userRoles.TRAINER) {
      elementArray.push({ component: ContentUploadButton, props: null });
    }
    if (role === userRoles.STUDENT || role === userRoles.TRAINER) {
      elementArray.push({
        component: UserIcon,
        props: { route: headerRoutes.userProfile },
      });
      elementArray.push({
        component: UserIcon,
        props: { route: headerRoutes.settings },
      });
    }
    if (role === userRoles.UNKNOWN) {
      elementArray.push({
        component: SignInLink,
        props: { className: classes.login },
      });
      elementArray.push({
        component: SignUpLink,
        props: { className: classes.buttonStyle },
      });
    }
    return (
      <Toolbar className={className}>
        {elementArray.map((block) => {
          return React.createElement(block.component, { ...block.props });
        })}
      </Toolbar>
    );
  };

  HeaderBar.propTypes = {
    role: PropTypes.string,
    className: PropTypes.string,
  };

  return (
    <AppBar className={classes.appBar}>
      <HeaderBar role={userRole} className={classes.container} />
    </AppBar>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    attributes: PropTypes.shape({ "custom:role": PropTypes.string }),
  }),
};

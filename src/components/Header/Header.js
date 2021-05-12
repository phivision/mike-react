import React from "react";
import { Link, useHistory } from "react-router-dom";
import { AppBar, Toolbar, Button, Icon, IconButton } from "@material-ui/core";
import styled from "styled-components";
import SearchBar from "material-ui-search-bar";
import logo from "../../assets/img/logo.jpg";
import PropTypes from "prop-types";
import { userRoles } from "../../variables/userRoles";
import { headerRoutes } from "routes";

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
    <Link to="/signup/trainer">
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
    <Link to="/signin" variant="h3">
      Log In
    </Link>
  );
};

const UserIcon = ({ route }) => {
  return (
    <Link to={route.path} key={route.name}>
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

  let history = useHistory();
  const [query, setQuery] = React.useState("");

  const ContentUploadButton = () => {
    const route = headerRoutes.videoUpload;
    return (
      <Link to={route.path} key={route.name}>
        <Button variant="contained" color="primary">
          Upload Content
        </Button>
      </Link>
    );
  };

  const Logo = () => {
    return (
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
    );
  };

  const SettingButton = () => {
    return (
      <IconButton onClick={() => history.push("/settings/")}>
        {typeof headerRoutes.settings.icon === "string" ? (
          <Icon>{headerRoutes.settings.icon}</Icon>
        ) : (
          <headerRoutes.settings.icon />
        )}
      </IconButton>
    );
  };

  return (
    <AppBar style={{ position: "static" }}>
      <Toolbar>
        <Logo />
        {userRole === userRoles.STUDENT || userRole === userRoles.UNKNOWN ? (
          <SearchButton
            value={query}
            placeholder={"Find a trainer"}
            onChange={(q) => setQuery(q)}
            onRequestSearch={() => history.push("/search/" + query)}
          />
        ) : null}
        {userRole === userRoles.TRAINER ? <ContentUploadButton /> : null}
        {userRole === userRoles.STUDENT || userRole === userRoles.TRAINER ? (
          <>
            <UserIcon route={headerRoutes.userProfile} />
            <SettingButton />
          </>
        ) : null}
        {userRole === userRoles.UNKNOWN ? (
          <>
            <SignInLink />
            <SignUpLink />
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
};

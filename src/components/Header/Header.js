import React from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "@material-ui/core";
import logo from "../../assets/img/logo.jpg";
import PropTypes from "prop-types";
import { userRoles } from "../../variables/userRoles";
import { headerRoutes } from "routes";
import {
  AppHeader,
  CustomButton,
  SearchButton,
  Bars,
  LogoLink,
  Nav,
  AttriTitle,
  CustomIcon,
} from "../StyledComponets/StyledComponets";

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

const UserIcon = ({ route }) => {
  return (
    <Nav to={route.path} key={route.name}>
      <CustomIcon>
        {typeof route.icon === "string" ? (
          <Icon>{route.icon}</Icon>
        ) : (
          <route.icon />
        )}
      </CustomIcon>
    </Nav>
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
  const handleOpenContentUpload = props.onContentUpload;

  let history = useHistory();
  const [query, setQuery] = React.useState("");

  const ContentUploadButton = () => {
    return (
      <CustomButton onClick={handleOpenContentUpload}>
        Upload Content
      </CustomButton>
    );
  };

  const Logo = () => {
    return (
      <LogoLink to="/">
        <img src={logo} alt="logo" />
      </LogoLink>
    );
  };

  const SettingButton = () => {
    return (
      <CustomIcon onClick={() => history.push("/settings/")}>
        {typeof headerRoutes.settings.icon === "string" ? (
          <Icon>{headerRoutes.settings.icon}</Icon>
        ) : (
          <headerRoutes.settings.icon />
        )}
      </CustomIcon>
    );
  };

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

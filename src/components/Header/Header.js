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

const UserButton = () => {
  const location = useLocation();
  let color = location.pathname === "/user" ? "primary" : "action";
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
        <img src={logo} alt="logo" />
      </LogoLink>
    ) : (
      <LogoLink to="/user">
        <img src={logo} alt="logo" />
      </LogoLink>
    );
  };

  const SettingButton = () => {
    const location = useLocation();
    let color = location.pathname === "/settings/" ? "primary" : "action";
    return (
      <CustomIcon color={color} onClick={() => history.push("/settings/")}>
        {typeof SetIcon === "string" ? <Icon>{SetIcon}</Icon> : <SetIcon />}
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

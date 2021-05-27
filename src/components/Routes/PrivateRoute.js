import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import { Auth } from "aws-amplify";

const PrivateRoute = ({ component: Component, user: user, ...rest }) => {
  const [auth, setAuth] = useState(false);

  const isAuthenticated = () => {
    setAuth(false);
    Auth.currentSession()
      .then((res) => {
        if (res.isValid()) {
          console.log("Logged in");
          setAuth(true);
        } else {
          console.log("No Auth");
          redirectToLogin();
        }
      })
      .catch(() => {
        redirectToLogin();
      });
  };

  const redirectToLogin = () => {
    history.push({
      pathname: "/signin",
      state: { next: rest.path },
    });
  };

  useEffect(() => {
    isAuthenticated();
  }, []);

  return (
    <Route
      {...rest}
      render={(p) => {
        return auth ? <Component user={user} {...p} /> : null;
      }}
    />
  );
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  user: PropTypes.object,
};

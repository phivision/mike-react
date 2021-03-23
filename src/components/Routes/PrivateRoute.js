import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, auth, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(p) =>
        auth ? (
          <Component {...p} user={user} />
        ) : (
          <Redirect
            to={{
              pathname: "/home/signin",
              state: { next: p.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  auth: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

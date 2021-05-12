import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, user: user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(p) =>
        user ? (
          <Component {...p} user={user} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
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
  user: PropTypes.object,
};

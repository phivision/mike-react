import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, auth, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? (
          <Component {...props} user={user} />
        ) : (
          <Redirect
            to={{
              pathname: "/home/signin",
              //TODO: Setup proper history/redirecting on login if user trying to directly go to a page.
              // state: { from: props.location },
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

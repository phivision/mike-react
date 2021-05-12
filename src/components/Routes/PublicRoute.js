import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";

//Basic wrapper for public route
const PublicRoute = ({ component: Component, authState, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => <Component {...props} auth={authState} user={user} />}
    />
  );
};

export default PublicRoute;

PublicRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  authState: PropTypes.bool,
  user: PropTypes.object,
};

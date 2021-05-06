import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";

//Basic wrapper for public route
const PublicRoute = ({ component: Component, auth, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => <Component {...props} auth={auth} user={user} />}
    />
  );
};

export default PublicRoute;

PublicRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  auth: PropTypes.bool,
  user: PropTypes.object,
};

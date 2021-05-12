import React from "react";
import { Route, useRouteMatch, Switch } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Container, Dialog } from "@material-ui/core";
// core components
import Footer from "components/Footer/Footer.js";
import Header from "components/Header/Header";

import { headerRoutes, routes } from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import PropTypes from "prop-types";

const useStyles = makeStyles(styles);

const Admin = ({ user, ...rest }) => {
  /*
  The propagated object "user" contains all user data pulled from aws cognito endpoint
  * */
  const userRole = user.attributes["custom:role"];

  const switchRoutes = (user, routes, url) => {
    return (
      <Switch>
        {routes.map((prop) => {
          if (prop.layout === "/admin") {
            return (
              <Route
                path={url + prop.path}
                render={(props) => (
                  <prop.component user={user} props={props} role={userRole} />
                )}
                key={prop.name}
                exact
              />
            );
          }
          return null;
        })}
      </Switch>
    );
  };

  // styles
  const classes = useStyles();
  // states and functions
  const match = useRouteMatch();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenSettings = () => {
    setOpenDialog(true);
  };

  const handleCloseSettings = () => {
    setOpenDialog(false);
  };

  console.log(rest);

  const SettingDialog = () => {
    const body = (
      <div>
        <headerRoutes.settings.component user={user.username} role={userRole} />
      </div>
    );
    return (
      <Dialog open={openDialog} onClose={handleCloseSettings}>
        {body}
      </Dialog>
    );
  };
  return (
    // {...rest} is removed
    <Container maxWidth={false} disableGutters={true}>
      <Header user={user} onSettings={handleOpenSettings} />
      <div className={classes.content}>
        <div className={classes.container}>
          {switchRoutes(user.username, routes, match.url)}
          <SettingDialog />
        </div>
      </div>
      <Footer />
    </Container>
  );
};

Admin.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    attributes: PropTypes.shape({ "custom:role": PropTypes.string.isRequired }),
  }),
};

export default Admin;

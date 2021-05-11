import React from "react";
import { Route, useRouteMatch, Switch } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Container, Dialog } from "@material-ui/core";
// core components
import Footer from "components/Footer/Footer.js";
import Header from "components/Header/Header";

import { headerRoutes, routes } from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import PropTypes from "prop-types";

let ps;

const useStyles = makeStyles(styles);

const Admin = ({ user, ...rest }) => {
  /*
  The propagated object "user" contains all user data pulled from aws cognito endpoint
  * */
  const userRole = user.attributes["custom:role"];

  const currentRoutes = routes.filter((route) => {
    if (
      (userRole === "trainer" && route.layoutCategory === "trainer") ||
      (userRole === "student" && route.layoutCategory === "student") ||
      route.layoutCategory === "both"
    ) {
      return true;
    }
  });

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
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
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
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  }, [mainPanel]);
  return (
    // {...rest} is removed
    <Container maxWidth={false} disableGutters={true}>
      <Header user={user} onSettings={handleOpenSettings} />
      <div className={classes.content}>
        <div className={classes.container}>
          {switchRoutes(user.username, currentRoutes, match.url)}
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

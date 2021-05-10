import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "../components/Header/Header.js";
import Footer from "../components/Footer/Footer.js";
import { routes } from "../routes.js";
import { Container } from "@material-ui/core";
import styles from "../assets/jss/material-dashboard-react/layouts/homeStyle.js";
import PropTypes from "prop-types";

let ps;
const useStyles = makeStyles(styles);

const Home = () => {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  const match = useRouteMatch();

  const switchRoutes = () => {
    return (
      <Switch>
        {routes.map((prop) => {
          if (prop.layout === "/home") {
            return (
              <Route
                exact={prop.exact}
                path={match.url + prop.path}
                render={(props) => <prop.component props={props} />}
                key={prop.name}
              />
            );
          }
          return null;
        })}
      </Switch>
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
    <Container maxWidth={false} disableGutters={true}>
      <Header />
      <div className={classes.content}>
        <div className={classes.container}>{switchRoutes()}</div>
      </div>
      <Footer />
    </Container>
  );
};

Home.propTypes = {
  auth: PropTypes.bool,
};

export default Home;

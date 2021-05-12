import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "../components/Header/Header.js";
import Footer from "../components/Footer/Footer.js";
import { routes } from "../routes.js";
import { Container } from "@material-ui/core";
import styles from "../assets/jss/material-dashboard-react/layouts/homeStyle.js";
import PropTypes from "prop-types";

const useStyles = makeStyles(styles);

const Home = () => {
  // styles
  const classes = useStyles();
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

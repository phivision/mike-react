import React from "react";
import { Route, useRouteMatch, Switch } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "../components/Navbars/Navbar.js";
import Footer from "../components/Footer/Footer.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

import routes from "../routes.js";

import styles from "../assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "../assets/img/sidebar-2.jpg";
import logo from "../assets/img/reactlogo.png";
import PropTypes from "prop-types";

let ps;

const useStyles = makeStyles(styles);

const Admin = ({ user, ...rest }) => {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const image = bgImage;
  const color = "blue";
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { path, url } = useRouteMatch();
  console.log(path);

  const switchRoutes = (user) => {
    return (
      <Switch>
        {routes.map((prop, key) => {
          if (prop.layout === "/admin") {
            return (
              <Route
                path={url + prop.path}
                render={() => <prop.component user={user} />}
                key={key}
                exact
              />
            );
          }
          return null;
        })}
      </Switch>
    );
  };

  console.log(rest);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
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
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  return (
    // {...rest} is removed
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"MIKE"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          userName={user.username}
        />
        <div className={classes.content}>
          <div className={classes.container}>{switchRoutes(user.username)}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

Admin.propTypes = {
  user: PropTypes.shape({ username: PropTypes.string.isRequired }),
};

export default Admin;

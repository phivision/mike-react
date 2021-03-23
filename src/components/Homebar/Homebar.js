import React from "react";
import { Link, useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";

import styles from "assets/jss/material-dashboard-react/components/headerStyle.js";

const useStyles = makeStyles(styles);

//TODO: Fix formatting
//TODO: Add trainer sign up functionality
//TODO: (For Later) Add functionality to display profile when signed in
export default function Header() {
  const classes = useStyles();
  let history = useHistory();

  const [query, setQuery] = React.useState("");
  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          <Link to="/home/">Mike</Link>
        </div>
        <SearchBar
          value={query}
          placeholder={"Find a trainer"}
          onChange={(q) => setQuery(q)}
          onRequestSearch={() => history.push("/home/search/" + query)}
        />
        <Link to="/home/signin">Log In</Link>
        <Link to="/home/trainersignup">Coach on Mike</Link>
      </Toolbar>
    </AppBar>
  );
}

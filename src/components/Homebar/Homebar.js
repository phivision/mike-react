import React from "react";
import { Link, useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import styles from "assets/jss/material-dashboard-react/components/headerStyle.js";
import styled from "styled-components";
import SearchBar from "material-ui-search-bar";
import logo from "../../assets/img/logo.jpg";

const useStyles = makeStyles(styles);
const SearchButton = styled(SearchBar)`
  &&& {
    margin-right: 20px;
    background-color: #eaeef1;
    box-shadow: none;
    border-radius: 20px;
    min-width: 300px;
    .MuiIconButton-label {
      color: #5dcbcb;
    }
  }
`;

//TODO: (For Later) Add functionality to display profile when signed in
export default function Header() {
  const classes = useStyles();
  let history = useHistory();

  const [query, setQuery] = React.useState("");
  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          <Link to="/home/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <SearchButton
          value={query}
          placeholder={"Find a trainer"}
          onChange={(q) => setQuery(q)}
          onRequestSearch={() => history.push("/home/search/" + query)}
          className={classes.searchBar}
        />
        <Link to="/home/signin" color="inherit" className={classes.login}>
          Log In
        </Link>
        <Link to="/home/trainersignup">
          <Button variant="contained" className={classes.buttonStyle}>
            Coach on Mike
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

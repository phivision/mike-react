/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { ListItem, List, Typography, Link, Container } from "@material-ui/core";
// core components
import styles from "assets/jss/material-dashboard-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://phivision.us/">
        PhiVision Inc.
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Footer() {
  const classes = useStyles();
  // TODO: adding & fixing links to company blog and contact us
  return (
    <footer className={classes.footer}>
      <Container className={classes.container}>
        <List className={classes.list}>
          <ListItem className={classes.inlineBlock}>
            <a href="../../home" className={classes.block}>
              Home
            </a>
          </ListItem>
          <ListItem className={classes.inlineBlock}>
            <a href="https://wordpress.com/" className={classes.block}>
              Blog
            </a>
          </ListItem>
          <ListItem className={classes.inlineBlock}>
            <a href="https://wordpress.com/" className={classes.block}>
              Contact Us
            </a>
          </ListItem>
        </List>
        <Copyright />
      </Container>
    </footer>
  );
}

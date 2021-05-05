/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Link, Typography } from "@material-ui/core";
// core components
import styles from "assets/jss/material-dashboard-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer() {
  const classes = useStyles();
  // TODO: adding & fixing links to company blog and contact us
  return (
    <footer>
      <Grid container>
        <Grid item xs>
          <Typography variant="body2" color="textSecondary" align="left">
            {"Copyright © " +
              new Date().getFullYear() +
              " PhiVision Inc. All rights reserved."}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Link href="https://www.iubenda.com/privacy-policy/84247709">
            Privacy Policy
          </Link>
        </Grid>
        <Grid item xs={1}>
          <Link href="https://www.iubenda.com/terms-and-conditions/84247709">
            Terms of Use
          </Link>
        </Grid>
      </Grid>
    </footer>
  );
}

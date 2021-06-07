/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { Grid, Link, Typography } from "@material-ui/core";

export default function Footer() {
  // TODO: adding & fixing links to company blog and contact us
  return (
    <footer>
      <Grid container alignItems="center">
        <Grid item xs>
          <Typography variant="body1" color="textSecondary" align="left">
            {"Copyright © " +
              new Date().getFullYear() +
              " PhiVision Inc. All rights reserved."}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Link
            variant="body1"
            href="https://www.iubenda.com/privacy-policy/84247709"
          >
            Privacy Policy
          </Link>
        </Grid>
        <Grid item xs={1}>
          <Link
            variant="body1"
            href="https://www.iubenda.com/terms-and-conditions/84247709"
          >
            Terms of Use
          </Link>
        </Grid>
      </Grid>
    </footer>
  );
}

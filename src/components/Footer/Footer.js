/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { Grid, Link } from "@material-ui/core";
import { CustomFooter, TextStyle } from "../StyledComponents/StyledComponents";

export default function Footer() {
  return (
    <CustomFooter>
      <Grid container alignItems="center">
        <Grid item xs>
          <TextStyle variant="body1" color="textSecondary" align="left">
            {"Copyright © " +
              new Date().getFullYear() +
              " PhiVision Inc. All rights reserved."}
          </TextStyle>
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
    </CustomFooter>
  );
}

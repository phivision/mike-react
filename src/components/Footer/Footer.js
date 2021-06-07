/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { Grid, Link } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {
  CustomFooter,
  TextLink,
  TextStyle,
} from "../StyledComponents/StyledComponents";

export default function Footer() {
  return (
    <CustomFooter>
      <Divider light />
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Grid item xs>
          <TextStyle variant="body2" color="textSecondary" align="left">
            {"Copyright © " +
              new Date().getFullYear() +
              " PhiVision Inc. All rights reserved."}
          </TextStyle>
        </Grid>
        <Grid item container justify="flex-end" xs>
          <Grid item>
            <TextLink
              variant="body2"
              href="https://www.iubenda.com/privacy-policy/84247709"
            >
              Privacy Policy
            </TextLink>
          </Grid>
          <Grid item>
            <TextLink
              variant="body2"
              href="https://www.iubenda.com/terms-and-conditions/84247709"
            >
              Terms of Use
            </TextLink>
          </Grid>
        </Grid>
      </Grid>
    </CustomFooter>
  );
}

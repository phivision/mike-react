/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { Grid } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {
  CustomFooter,
  TextExtLink,
  TextStyle,
} from "../StyledComponents/StyledComponents";
import Box from "@material-ui/core/Box";

export default function Footer() {
  return (
    <CustomFooter>
      <Divider light />
      <Box m={1}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs>
            <TextStyle variant="body2" color="textSecondary" align="left">
              {"Copyright © " + new Date().getFullYear() + " PhiVision Inc."}
            </TextStyle>
          </Grid>
          <Grid item container justifyContent="flex-end" xs>
            <Grid item>
              <TextExtLink
                variant="body2"
                href="https://www.iubenda.com/privacy-policy/84247709"
                text="Privacy Policy"
              />
            </Grid>
            <Grid item>
              <TextExtLink
                variant="body2"
                href="https://www.iubenda.com/terms-and-conditions/84247709"
                text="Terms of Use"
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CustomFooter>
  );
}

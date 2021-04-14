import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Button,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PropTypes from "prop-types";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import AlignItemsList from "./comment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  BImage: {
    background: `url(${"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2620721125,1355879679&fm=26&gp=0.jpg"})`,
    backgroundSize: "100% 100%",
    height: "200px",
  },
  avatar: {
    width: "150px",
    height: "150px",
  },
  CardBox: {
    height: "100px",
    backgroundColor: "#eefaff",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "20px",
  },
  profileSection: {
    backgroundColor: "white",
    margin: "2px",
  },
  CardStlye: {
    border: "none",
    boxShadow: "none",
  },
  profileCardStlye: {
    borderRight: "2px solid #bbe1f1",
    boxShadow: "none",
  },
}));

const CenteredGrid = ({ profile }) => {
  const classes = useStyles();
  console.log(profile);
  return !profile ? (
    "Loading..."
  ) : (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.BImage}></Grid>
        <Grid container spacing={2} className={classes.profileSection}>
          <Grid item xs={6}>
            <Card className={classes.profileCardStlye}>
              <CardHeader
                avatar={
                  <Avatar
                    aria-label="recipe"
                    className={classes.avatar}
                    src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3879298782,3698363030&fm=26&gp=0.jpg"
                  />
                }
                title={profile.FirstName + " " + profile.LastName}
                subheader={
                  "Email: " +
                  profile.Email +
                  "\n" +
                  profile.Gender +
                  " | " +
                  profile.Height +
                  "cm | " +
                  profile.Weight
                }
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  Biograpghy
                </Typography>
                <CardContent className={classes.CardBox}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {profile.Description}
                  </Typography>
                </CardContent>
              </CardContent>
              <CardActions disableSpacing>
                <Grid item xs={9}>
                  <IconButton aria-label="add to favorites" color="secondary">
                    <FavoriteIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<MonetizationOnIcon />}
                  >
                    Pay
                  </Button>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className={classes.CardStlye}>
              <CardContent>
                <Typography variant="h6" component="h2">
                  What people are saying
                </Typography>
                <AlignItemsList />
                {/* <CardContent className={classes.CardBox}>
                  <Typography variant="body2" color="textSecondary" component="p">
                    I like this trainer!
                  </Typography>
                </CardContent> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

CenteredGrid.propTypes = {
  profile: PropTypes.object,
};

export default CenteredGrid;

import React from "react";
import {
  Container,
  Typography,
  InputBase,
  Paper,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(() => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "65%",
    boxShadow: "none",
    margin: "20px auto",
    height: "70px",
    fontFamily: "Arial Rounded MT Bold",
  },
  HomeSection: {
    backgroundColor: "white",
    maxWidth: "none",
    textAlign: "center",
    fontWeight: 500,
    padding: "5% 0",
  },
  input: {
    flex: 1,
    padding: "6px 20px",
    fontSize: "30px",
    fontWeight: 500,
    backgroundColor: "#ecedf1",
    borderRadius: "20px 0 0 20px",
    height: "100%",
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#5dcbcb",
    height: "100%",
    width: "120px",
    color: "white",
    borderRadius: "0 20px 20px 0",
  },
  mikeStlye: {
    color: "#5dcbcb",
    fontFamily: "Futura",
    fontWeight: 600,
    marginLeft: "20px",
    fontSize: "4rem",
  },
}));

const HomeSearch = () => {
  const classes = useStyles();
  return (
    <Container disableGutters={true} className={classes.HomeSection}>
      <Typography variant="h3">
        Search the 200,000+ Apple Music On
        <h className={classes.mikeStlye}>MIKE</h>
      </Typography>
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Search your liked trainer"
          inputProps={{ "aria-label": "Search your liked trainer" }}
        />
        <Button
          type="submit"
          className={classes.iconButton}
          aria-label="search"
          size="medium"
        >
          <SearchIcon fontSize="large" />
        </Button>
      </Paper>
    </Container>
  );
};

export default HomeSearch;

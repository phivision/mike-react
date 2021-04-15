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
    width: "60%",
    boxShadow: "none",
    backgroundColor: "#ecedf1",
    borderRadius: "20px",
    margin: "20px auto",
    height: "60px",
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
    padding: "20px",
    fontSize: "30px",
    fontWeight: 500,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#5dcbcb",
    height: "100%",
    width: "120px",
    color: "white",
  },
}));

const HomeSearch = () => {
  const classes = useStyles();
  return (
    <Container disableGutters={true} className={classes.HomeSection}>
      <Typography variant="h3">
        Search the 200,000+ Apple Music On MIKE
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
          <SearchIcon />
        </Button>
      </Paper>
    </Container>
  );
};

export default HomeSearch;

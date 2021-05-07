import React from "react";
import { Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {
  HomeSection,
  MikeStlye,
  SearchButton,
} from "assets/jss/material-dashboard-react/views/homeSearchStyle";

const HomeSearch = () => {
  const [query, setQuery] = React.useState("");
  let history = useHistory();
  return (
    <HomeSection disableGutters={true}>
      <Typography variant="h3">
        Search the 200,000+ Apple Music On
        <MikeStlye>MIKE</MikeStlye>
      </Typography>
      <SearchButton
        value={query}
        placeholder={"Search your liked trainer"}
        onChange={(q) => setQuery(q)}
        onRequestSearch={() => history.push("/home/search/" + query)}
      />
    </HomeSection>
  );
};

export default HomeSearch;

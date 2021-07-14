import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import PropTypes from "prop-types";
import ProfileCard from "../../components/Card/ProfileCard.js";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { TextStyle } from "../../components/StyledComponents/StyledComponents";
import Box from "@material-ui/core/Box";

const trainerSearch = /* GraphQL */ `
  query TrainerSearch($keyword: String!) {
    trainerSearch(keyword: $keyword) {
      items {
        id
        UserImage
        LastName
        FirstName
        IsVerified
        Description
        LandingURL
      }
    }
  }
`;

export default function Search({ ...props }) {
  const [trainers, setTrainers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const trainerQuery = async () => {
    const trainerList = await API.graphql({
      query: trainerSearch,
      variables: {
        keyword: props.match.params.query,
      },
    });
    return trainerList.data.trainerSearch.items;
  };

  useEffect(() => {
    trainerQuery().then((r) => {
      setTrainers(r);
      setLoaded(true);
    });
  }, [props.match.params.query]);

  return (
    <>
      {loaded ? (
        <Container maxWidth="md">
          <Box mt={2}>
            <Grid container direction="column">
              <Grid item>
                <TextStyle variant="h1">
                  {'Results for: "' + props.match.params.query + '"'}
                </TextStyle>
              </Grid>
              <Grid item>
                {trainers.map((trainer, idx) => {
                  return (
                    <Box my={3} key={idx}>
                      <ProfileCard key={idx} profile={trainer} />
                    </Box>
                  );
                })}
              </Grid>
            </Grid>
          </Box>
        </Container>
      ) : (
        <>Loading...</>
      )}
    </>
  );
}

Search.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      query: PropTypes.string.isRequired,
    }),
  }),
};

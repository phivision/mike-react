import React, { useEffect } from "react";
import { API } from "aws-amplify";
import { searchUserProfiles } from "graphql/queries";
import PropTypes from "prop-types";
import ProfileCard from "../../components/ProfileCard/ProfileCard.js";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export default function Search({ ...props }) {
  const [trainers, setTrainers] = React.useState([]);

  async function trainerQuery() {
    const trainerList = await API.graphql({
      query: searchUserProfiles,
      variables: {
        limit: 10,
        filter: {
          UserRole: { match: "trainer" },
          or: [
            { FirstName: { match: props.match.params.query } },
            { LastName: { match: props.match.params.query } },
          ],
        },
      },
      authMode: "AWS_IAM",
    });
    if (trainerList.data.searchUserProfiles.items != null) {
      return trainerList.data.searchUserProfiles.items;
    }
  }

  useEffect(() => {
    trainerQuery().then((r) => setTrainers(r));
  }, [props.match.params.query]);

  return (
    <div>
      <Grid direction="row">
        <Grid item xs={3}>
          <Typography variant="h1">
            {"Results for: " + props.props.match.params.query}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {trainers.map((trainer, idx) => {
            return <ProfileCard key={idx} profile={trainer} />;
          })}
        </Grid>
      </Grid>
    </div>
  );
}

Search.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      query: PropTypes.string.isRequired,
    }),
  }),
};

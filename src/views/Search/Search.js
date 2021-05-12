import React, { useEffect } from "react";
import { API } from "aws-amplify";
import { searchUserProfiles } from "graphql/queries";
import PropTypes from "prop-types";
import { Container } from "@material-ui/core";
import ProfileCard from "../../components/ProfileCard/ProfileCard.js";

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
      <Container
        style={{ backgroundColor: "white", padding: "20px", maxWidth: "none" }}
      >
        {trainers.map((trainer, idx) => {
          console.log(trainer);
          return <ProfileCard key={idx} profile={trainer} />;
        })}
      </Container>
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

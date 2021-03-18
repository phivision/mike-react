import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import { searchUserProfiles } from "graphql/queries";
import PropTypes from "prop-types";

const trainerList = (trainers) => {
  if (!trainers) {
    return;
  }

  return (
    <div>
      {trainers.map((query, key) => {
        return (
          <Link key={key} to={{ pathname: "/home/landingpage/" + query.id }}>
            {"Trainer: " + query.FirstName + " " + query.LastName}
          </Link>
        );
      })}
    </div>
  );
};

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
            { FirstName: { match: props.props.match.params.query } },
            { LastName: { match: props.props.match.params.query } },
          ],
        },
      },
      authMode: "AWS_IAM",
    });
    console.log(trainerList.data.searchUserProfiles.items);
    console.log(props.props.match.params.query);
    if (trainerList.data.searchUserProfiles.items != null) {
      return trainerList.data.searchUserProfiles.items;
    }
  }

  useEffect(() => {
    trainerQuery().then((r) => setTrainers(r));
  }, [trainers.length]);

  return (
    <div>
      <div>Search Results</div>
      <div>{trainerList(trainers)}</div>
    </div>
  );
}

Search.propTypes = {
  props: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.shape({
        query: PropTypes.string.isRequired,
      }),
    }),
  }),
};

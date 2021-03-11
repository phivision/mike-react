import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { getUserProfile } from "graphql/queries";

const trainerList = (trainers) => {
  if (!trainers) {
    return;
  }

  return (
    <div>
      {trainers.map((query, key) => {
        return (
          <Link key={key} to={{ pathname: "/landingpage/" + query.id }}>
            {"Trainer: " + query.FirstName + " " + query.LastName}
          </Link>
        );
      })}
    </div>
  );
};

export default function Home() {
  const [trainers, setTrainers] = React.useState();

  async function trainerQuery() {
    const trainerList = await API.graphql(
      graphqlOperation(getUserProfile, { id: "sample" }) //Need to select correct query
    );
    if (trainerList.data.getUserProfile != null) {
      return trainerList.data.getUserProfile;
    } else {
      alert("cannot find user profile!");
    }
  }

  useEffect(() => {
    trainerQuery().then((r) => setTrainers(r));
    // TODO: need to do useEffect cleanup and fix uncaught (in promise) object
  });

  return (
    <div>
      <div>Welcome to Mike</div>
      <div>{trainerList(trainers)}</div>
      <Link to="/home/landingpage/343">Trainer 1</Link>
    </div>
  );
}

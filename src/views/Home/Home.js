import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import { listUserProfiles } from "graphql/queries";

//TODO: Need to add home page
const trainerList = (trainers) => {
  if (!trainers) {
    return;
  }

  return (
    <div>
      {trainers.map((trainer, idx) => {
        return (
          <Link key={idx} to={{ pathname: "/home/landingpage/" + trainer.id }}>
            {"Trainer: " + trainer.FirstName + " " + trainer.LastName}
          </Link>
        );
      })}
    </div>
  );
};

export default function Home() {
  const [trainers, setTrainers] = React.useState([]);

  async function trainerQuery() {
    const trainerList = await API.graphql({
      query: listUserProfiles,
      variables: { limit: 10, filter: { UserRole: { contains: "trainer" } } },
      authMode: "AWS_IAM",
    });
    if (trainerList.data.listUserProfiles.items != null) {
      return trainerList.data.listUserProfiles.items;
    }
  }

  useEffect(() => {
    trainerQuery()
      .then((r) => setTrainers(r))
      .catch(console.log);
  }, [trainers.length]);

  return (
    <div>
      <div>Welcome to Mike</div>
      <div>{trainerList(trainers)}</div>
    </div>
  );
}

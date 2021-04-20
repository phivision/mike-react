import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import { listUserProfiles } from "graphql/queries";
import Banner from "../Banner/banner";
import HomeSearch from "../HomeSearch/HomeSearch";
import MikeIntro from "../MikeIntro/MikeIntro";

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
      variables: { filter: { UserRole: { contains: "trainer" } } },
      authMode: "AWS_IAM",
    });
    console.log(trainerList);
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
      <Banner />
      <HomeSearch />
      <MikeIntro />
      <div>Welcome to Mike</div>
      <div>{trainerList(trainers)}</div>
    </div>
  );
}

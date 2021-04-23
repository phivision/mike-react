import React, { useEffect } from "react";
import { API } from "aws-amplify";
import { searchUserProfiles } from "graphql/queries";
import PropTypes from "prop-types";
import { Container } from "@material-ui/core";
import Banner from "../../components/Banner/banner";
import banner from "assets/img/banner2.jpeg";
import TrainerCard from "../../components/Card/TrainerCard";

export default function SearchResult({ ...props }) {
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
      <Banner bannerURL={banner} bannerText="Pilates" />
      <Container
        style={{ backgroundColor: "white", padding: "20px", maxWidth: "none" }}
      >
        {trainers.map((trainer, idx) => {
          return <TrainerCard key={idx} id={trainer.id} />;
        })}
      </Container>
    </div>
  );
}

SearchResult.propTypes = {
  props: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.shape({
        query: PropTypes.string.isRequired,
      }),
    }),
  }),
};

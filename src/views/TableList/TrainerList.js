import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { API } from "aws-amplify";
import { listUserProfiles } from "graphql/queries";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function TrainerList() {
  const classes = useStyles();
  const [trainers, setTrainers] = useState([]);

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
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Current trainers</h4>
            <p className={classes.cardCategoryWhite}>A list of trainers</p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Name", "Gender", "Description", "Subscription Rate"]}
              tableData={trainers.map((trainer) => {
                return [
                  trainer.FirstName + " " + trainer.LastName,
                  trainer.Gender,
                  trainer.Description,
                  Number(trainer.Price).toString(),
                ];
              })}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

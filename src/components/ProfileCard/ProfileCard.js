import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Storage } from "aws-amplify";
import { useHistory } from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";
import TrainerMetrics from "../TrainerMetrics/TrainerMetrics";
import {
  GridContainer,
  GridItem,
  CardStyled,
  CardIcon,
  H3title,
  Text,
} from "../StyledComponets/StyledComponets";

const ProfileCard = ({ ...props }) => {
  const [img, setImg] = useState();
  let history = useHistory();

  useEffect(() => {
    Storage.get(props.profile.UserImage).then((d) => {
      setImg(d);
    });
  }, [props]);

  const link = () => {
    history.push("/landingpage/" + props.profile.id);
  };

  return (
    <CardStyled>
      <CardActionArea onClick={link}>
        <GridContainer direction="row">
          <GridItem xs={4} sm={2}>
            <CardIcon src={img} />
          </GridItem>
          <GridContainer item direction="column" xs={8} sm={4}>
            <GridItem>
              <H3title>
                {props.profile.FirstName + " " + props.profile.LastName}
              </H3title>
            </GridItem>
            <GridItem>
              <Text>{props.profile.Description}</Text>
            </GridItem>
          </GridContainer>
          <GridItem xs={12} sm={6}>
            <TrainerMetrics
              weight={props.profile.Weight}
              height={props.profile.Height}
              birthday={props.profile.Birthday}
            />
          </GridItem>
        </GridContainer>
      </CardActionArea>
    </CardStyled>
  );
};

export default ProfileCard;

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    FirstName: PropTypes.string,
    LastName: PropTypes.string,
    Description: PropTypes.string,
    Weight: PropTypes.number,
    Height: PropTypes.number,
    Birthday: PropTypes.string,
    UserImage: PropTypes.string,
    id: PropTypes.string,
  }),
};

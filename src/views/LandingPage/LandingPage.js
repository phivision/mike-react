import React, { useState, useEffect } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import PropTypes from "prop-types";
import { Grid, Typography, Card, CardActionArea } from "@material-ui/core";
import TrainerMetrics from "../../components/TrainerMetrics/TrainerMetrics";
import ContentCard from "../../components/ContentCard/ContentCard";
import {
  createUserFavoriteContent,
  deleteUserFavoriteContent,
} from "../../graphql/mutations";
import WorkoutCard from "../../components/WorkoutCard/WorkoutCard";

// import initial profile
const initialProfileState = {
  id: "",
  LastName: "",
  FirstName: "",
  Description: null,
  UserImage: null,
  UserURL: null,
  BgImage: null,
  BgURL: null,
  RegDate: "",
  Birthday: null,
  Email: "",
  Gender: null,
  Height: null,
  Weight: null,
  Price: null,
  StripID: null,
};
//TODO: Add payment functionality
//TODO: Add cards for payment tiers
//TODO: Add images + description, nicely formatted

export default function LandingPage({ ...props }) {
  const [profile, setProfile] = useState(initialProfileState);
  const [price, setPrice] = useState("");
  const [favorites, setFavorites] = useState("");

  const editFavorite = (id, contentId) => {
    if (id) {
      console.log("Deleting subscription: " + id.id);
      API.graphql(
        graphqlOperation(deleteUserFavoriteContent, {
          input: { id: id.id },
        })
      )
        .then(() => {
          const i = favorites.findIndex((e) => e.Content.id === contentId);
          favorites.splice(i, 1);
        })
        .catch(console.log);
    } else {
      console.log(
        "Creating subscription for " + props.user + " and content " + contentId
      );
      API.graphql(
        graphqlOperation(createUserFavoriteContent, {
          input: {
            userFavoriteContentUserId: props.user,
            userFavoriteContentContentId: contentId,
          },
        })
      )
        .then((d) => {
          favorites.push(d.data.createUserFavoriteContent);
        })
        .catch(console.log);
    }
  };

  async function userQuery() {
    const query = /* GraphQL */ `
      query GetUserProfile($id: ID!) {
        getUserProfile(id: $id) {
          id
          Birthday
          Height
          UserImage
          BgImage
          LastName
          FirstName
          Weight
          Description
          Favorites {
            items {
              id
              Content {
                id
              }
            }
            nextToken
          }
          Contents {
            items {
              id
              ContentName
              Description
              Title
              Level
              Length
              IsDemo
              Thumbnail
              Segments
              createdAt
            }
            nextToken
          }
        }
      }
    `;
    const userProfileData = await API.graphql(
      graphqlOperation(query, { id: props.user })
    );

    setFavorites(userProfileData.data.getUserProfile.Favorites.items);
    setProfile(userProfileData.data.getUserProfile);
    userProfile.UserURL = await Storage.get(
      userProfileData.data.getUserProfile.UserImage
    );
    userProfile.BgURL = await Storage.get(
      userProfileData.data.getUserProfile.BgImage
    );
  }

  const getPrice = async (id) => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/get/price", myInit)
      .then((res) => {
        console.log(res);
        setPrice(res.data.data[0].unit_amount);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onClick = () => {
    console.log("Checkouts");
  };

  useEffect(() => {
    getPrice(props.props.match.params.id);
    userQuery();
  }, [props.props.match.params.id]);

  return (
    <Grid container direction="row">
      <Grid item container direction="column" xs={4}>
        <Grid item>
          <img style={{ width: "200px" }} src={profile.UserURL} />
        </Grid>
        <Grid item>
          <Typography variant="h3">
            {profile.FirstName + " " + profile.LastName}
          </Typography>
        </Grid>
        <Grid item variant="body1">
          {profile.Description}
        </Grid>
        <Grid item>
          <TrainerMetrics
            birthday={profile.Birthday}
            weight={profile.Weight}
            height={profile.Height}
          />
        </Grid>
        <Grid item>
          <Card>
            <CardActionArea onClick={onClick}>
              <Typography variant="h1">{price}</Typography>
              <Typography>Join</Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
      <Grid item container xs={4}>
        <Grid item>
          <Typography variant="h1">Feed</Typography>
        </Grid>
        {videos.map((video, idx) => {
          // let f = favorites.findIndex((e) => e.Content.id === video.id);
          console.log(video.Segments);
          return (
              <WorkoutCard
                  post={video}
                  user={user}
                  segments={video.Segments}
                  clickCallback={click}
                  key={idx}
              />
          );}
      </Grid>
      <Grid item container xs={4}>
        <Grid item>
          <Typography variant="h1">Favorite Workouts</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

LandingPage.propTypes = {
  props: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }),
  }),
};

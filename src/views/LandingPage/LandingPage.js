import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { Grid, Typography } from "@material-ui/core";
import TrainerMetrics from "../../components/TrainerMetrics/TrainerMetrics";
import ContentCard from "../../components/ContentCard/ContentCard";
import WorkoutCard from "../../components/WorkoutCard/WorkoutCard";
import Banner from "assets/img/banner.jpeg";
import {
  createUserFavoriteContent,
  deleteUserFavoriteContent,
} from "../../graphql/mutations";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import Button from "@material-ui/core/Button";

// import initial profile
const initialProfileState = {
  id: "",
  Birthday: null,
  Height: null,
  UserImage: null,
  BgImage: null,
  LastName: "",
  FirstName: "",
  Weight: null,
  Description: null,
};
//TODO: Add payment functionality
//TODO: Add cards for payment tiers
//TODO: Add images + description, nicely formatted

export default function LandingPage({ ...props }) {
  const [profile, setProfile] = useState(initialProfileState);
  const [content, setContent] = useState([]);
  const [price, setPrice] = useState("");
  const [favorites, setFavorites] = useState([]);

  const editFavorite = (id, contentId) => {
    if (id) {
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
      API.graphql(
        graphqlOperation(createUserFavoriteContent, {
          input: {
            userFavoriteContentUserId: profile.id,
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
    API.graphql(graphqlOperation(query, { id: props.match.params.id }))
      .then((d) => {
        const { Contents, Favorites, ...p } = d.data.getUserProfile;
        setContent(Contents.items);
        setFavorites(Favorites.items);
        setProfile(p);
      })
      .catch((e) => console.log(e));
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
        setPrice(res.data.data[0].unit_amount / 100);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onClick = () => {
    console.log("Checkouts");
  };

  useEffect(() => {
    getPrice(props.match.params.id);
    userQuery();
  }, [props.match.params.id]);

  return (
    <Grid container direction="column">
      <Grid
        item
        style={{
          backgroundImage: `url(` + Banner + `)`,
          height: "500px",
        }}
      />
      <Grid item container direction="row">
        <Grid item container direction="column" xs={4}>
          <Grid item>
            <UserAvatar
              style={{
                width: "200px",
                height: "200px",
              }}
              UserImage={profile.UserImage}
            />
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
            <Button variant="contained" color="primary" onClick={onClick}>
              {"Join for $" + price + " per month"}
            </Button>
          </Grid>
        </Grid>
        <Grid item container xs={4}>
          <Grid item>
            <Typography variant="h1">Feed</Typography>
          </Grid>
          {content.map((content, idx) => {
            let f = favorites.findIndex((e) => e.Content.id === content.id);
            return (
              <ContentCard
                post={content}
                user={profile}
                favorite={favorites[f]}
                segments={content.Segments}
                clickCallback={onClick}
                favoriteCallback={editFavorite}
                key={idx}
              />
            );
          })}
        </Grid>
        <Grid item container xs={4}>
          <Grid item>
            <Typography variant="h1">Favorite Workouts</Typography>
          </Grid>
          {favorites.map((fav, idx) => {
            let f = content.findIndex((e) => {
              return e.id === fav.Content.id;
            });
            if (f > -1) {
              return (
                <WorkoutCard
                  post={content[f]}
                  user={profile}
                  favorite={fav}
                  segments={content[f].Segments}
                  clickCallback={onClick}
                  favoriteCallback={editFavorite}
                  key={idx}
                />
              );
            }
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}

LandingPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

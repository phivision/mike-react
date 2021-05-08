import React, { useState, useEffect } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import PropTypes from "prop-types";
import { Grid, Typography, Card, CardActionArea } from "@material-ui/core";
import TrainerMetrics from "../../components/TrainerMetrics/TrainerMetrics";
import ContentCard from "../../components/ContentCard/ContentCard";
import Banner from "assets/img/banner.jpeg";
import {
  createUserFavoriteContent,
  deleteUserFavoriteContent,
} from "../../graphql/mutations";

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
  const [userImg, setUserImg] = useState("");

  const editFavorite = (id, contentId) => {
    console.log(id);
    console.log(contentId);
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
    API.graphql(graphqlOperation(query, { id: props.props.match.params.id }))
      .then((d) => {
        const { Contents, Favorites, ...p } = d.data.getUserProfile;
        setContent(Contents.items);
        setFavorites(Favorites.items);
        setProfile(p);
        console.log(content);
        console.log(favorites);
        console.log(p);
        console.log(profile);
        Storage.get(d.data.getUserProfile.UserImage)
          .then((d) => {
            setUserImg(d);
          })
          .catch(console.log);
      })
      .catch(console.log);
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
            <img style={{ width: "200px" }} src={userImg} />
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
            let f = content.findIndex((e) => e.id === fav.id);
            if (f) {
              return (
                <ContentCard
                  post={content}
                  user={profile}
                  favorite={fav}
                  segments={content.Segments}
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
  props: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }),
  }),
};

import React, { useState, useEffect } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import PropTypes from "prop-types";
import { Avatar, Grid, Typography, Button } from "@material-ui/core";
import ContentCard from "../../components/ContentCard/ContentCard";
import WorkoutCard from "../../components/WorkoutCard/WorkoutCard";
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
  UserURL: null,
  LastName: "",
  FirstName: "",
  Weight: null,
  Description: null,
};
//TODO: Add payment functionality
//TODO: Add cards for payment tiers
//TODO: Add images + description, nicely formatted

export default function UserFeed({ ...props }) {
  const [profile, setProfile] = useState(initialProfileState);
  const [subscriptions, setSubscriptions] = useState([]);
  const [content, setContent] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const onClick = () => {};

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
    const query = `query GetUserProfile ($id: ID!) {
          getUserProfile(id: $id) {
            Subscriptions {
              items {
                Trainer {
                  Contents {
                    items {
                      id
                      Description
                      createdAt
                      Thumbnail
                    }
                  }
                  FirstName
                  LastName
                  id
                  UserImage
                }
              }
            }
            Favorites {
              items {
                Content {
                  id
                  Title
                  Thumbnail
                  createdAt
                  Description
                }
              }
            }
            LastName
            FirstName
            UserImage
            Description
          }
        }`;

    API.graphql(graphqlOperation(query, { id: props.user }))
      .then((d) => {
        const { Subscriptions, Favorites, ...p } = d.data.getUserProfile;
        setProfile(p);
        setFavorites(Favorites.items);
        setSubscriptions(Subscriptions.items);
      })
      .catch(console.log);
  }

  useEffect(() => {
    subscriptions.map((sub) => {
      Storage.get(sub.UserImage).then((d) => (sub.UserURL = d));
    });
  }, [subscriptions]);

  useEffect(() => {
    subscriptions.map((sub) => {
      setContent([...content, ...sub.Trainer.Contents.items]);
    });
  }, [subscriptions]);

  useEffect(() => {
    Storage.get(profile.UserImage).then((d) => {
      setProfile({ ...profile, UserURL: d });
    });
  }, [profile.UserImage]);

  useEffect(() => {
    userQuery();
  }, [props.user]);

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
            <Button>Edit</Button>
          </Grid>
          <Grid item>
            <Typography variant="h3">My Trainers</Typography>
          </Grid>
          <Grid item container direction="rows">
            {subscriptions.map((sub, idx) => {
              console.log(sub);
              console.log("UserURL: " + sub.UserURL);
              console.log(sub);
              return (
                <Avatar alt="Profile Picture" src={sub.UserURL} key={idx} />
              );
            })}
          </Grid>
        </Grid>
        <Grid item container xs={4}>
          <Grid item>
            <Typography variant="h1">Feed</Typography>
          </Grid>
          {content.map((c, idx) => {
            let f = favorites.findIndex((e) => e.Content.id === c.id);
            return (
              <ContentCard
                post={c}
                user={profile}
                favorite={favorites[f]}
                segments={c.Segments}
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

UserFeed.propTypes = {
  user: PropTypes.string,
};

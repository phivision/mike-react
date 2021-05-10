import React, { useState, useEffect } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import PropTypes from "prop-types";
import { Grid, Typography, Button } from "@material-ui/core";
import ContentCard from "../../components/ContentCard/ContentCard";
import WorkoutCard from "../../components/WorkoutCard/WorkoutCard";
import Banner from "assets/img/banner.jpeg";
import { updateUserProfile } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import EditableTypography from "../../components/EditableTypography/EditableTypography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";

// import initial profile
const initialProfileState = {
  id: "",
  Birthday: null,
  Height: null,
  UserImage: null,
  LastName: "",
  FirstName: "",
  Weight: null,
  Description: null,
};
let tempProfile;

//TODO: Add payment functionality
//TODO: Add cards for payment tiers
//TODO: Add images + description, nicely formatted

export default function UserFeed({ ...props }) {
  const [profile, setProfile] = useState(initialProfileState);
  const [subscriptions, setSubscriptions] = useState([]);
  const [content, setContent] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [edit, setEdit] = useState(false);
  const history = useHistory();

  const onClick = () => {};

  const onChange = (e) => {
    switch (e.target.id) {
      case "firstName":
        setProfile({ ...profile, FirstName: e.target.value });
        break;
      case "lastName":
        setProfile({ ...profile, LastName: e.target.value });
        break;
      case "description":
        setProfile({ ...profile, Description: e.target.value });
        break;
    }
  };

  const clickEdit = async (type) => {
    if (edit) {
      if (type === "submit-changes") {
        API.graphql({
          query: updateUserProfile,
          variables: { input: profile },
        });
      } else {
        setProfile(tempProfile);
      }
    } else {
      tempProfile = { ...profile };
    }
    setEdit(!edit);
  };

  const editFavorite = (fav, contentId) => {
    if (fav) {
      console.log("Deleting favorite: " + fav.id);

      const deleteUserFavoriteContent = /* GraphQL */ `
        mutation DeleteUserFavoriteContent(
          $input: DeleteUserFavoriteContentInput!
        ) {
          deleteUserFavoriteContent(input: $input) {
            User {
              Favorites {
                items {
                  Content {
                    id
                    Title
                    Thumbnail
                    createdAt
                    Description
                    Segments
                  }
                  id
                }
              }
            }
          }
        }
      `;

      API.graphql(
        graphqlOperation(deleteUserFavoriteContent, {
          input: { id: fav.id },
        })
      )
        .then((d) => {
          setFavorites(d.data.deleteUserFavoriteContent.User.Favorites.items);
        })
        .catch(console.log);
    } else {
      console.log("Creating favorite: " + contentId + " " + profile.id);

      const createUserFavoriteContent = /* GraphQL */ `
        mutation CreateUserFavoriteContent(
          $input: CreateUserFavoriteContentInput!
        ) {
          createUserFavoriteContent(input: $input) {
            User {
              Favorites {
                items {
                  Content {
                    id
                    Title
                    Thumbnail
                    createdAt
                    Description
                    Segments
                  }
                  id
                }
              }
            }
          }
        }
      `;

      API.graphql(
        graphqlOperation(createUserFavoriteContent, {
          input: {
            userFavoriteContentUserId: profile.id,
            userFavoriteContentContentId: contentId,
          },
        })
      )
        .then((d) => {
          setFavorites(d.data.createUserFavoriteContent.User.Favorites.items);
        })
        .catch(console.log);
    }
  };

  const handleImageChange = async (e) => {
    if (!e.target.files[0]) return;
    const nameArray = e.target.files[0].name.split(".");
    const userImageName =
      ("UserImage" + props.user + Date.now()).replace(/[^0-9a-z]/gi, "") +
      "." +
      nameArray[nameArray.length - 1];
    await Storage.put(userImageName, e.target.files[0], {
      contentType: "image/*",
    });
    setProfile({ ...profile, UserImage: userImageName });
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
                      Title
                      createdAt
                      Thumbnail
                      Segments
                      Creator {
                        UserImage
                      }
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
                  Segments
                }
                id
              }
            }
            id
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
      setContent([...content, ...sub.Trainer.Contents.items]);
    });
  }, [subscriptions]);

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
            {edit ? (
              <div>
                <input
                  accept="image/*"
                  id="profile-upload"
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="profile-upload">
                  <IconButton component="span">
                    <UserAvatar
                      style={{
                        width: "200px",
                        height: "200px",
                      }}
                      UserImage={profile.UserImage}
                    />
                  </IconButton>
                </label>
              </div>
            ) : (
              <UserAvatar
                style={{
                  width: "200px",
                  height: "200px",
                }}
                UserImage={profile.UserImage}
              />
            )}
          </Grid>
          <Grid item>
            <EditableTypography
              variant="h3"
              label="First Name"
              text={profile.FirstName}
              edit={edit}
              onChange={onChange}
              id="firstName"
              style={{ display: "inline" }}
            />
            <EditableTypography
              variant="h3"
              text={" "}
              style={{ display: "inline" }}
            />
            <EditableTypography
              variant="h3"
              label="Last Name"
              text={profile.LastName}
              edit={edit}
              onChange={onChange}
              id="lastName"
              style={{ display: "inline" }}
            />
          </Grid>
          <Grid item variant="body1">
            <EditableTypography
              variant="body1"
              edit={edit}
              label="Description"
              fullWidth={true}
              onChange={onChange}
              id="description"
              text={profile.Description}
            />
          </Grid>
          <Grid item>
            {edit ? (
              <Container>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth={true}
                  onClick={() => clickEdit("submit-changes")}
                >
                  Submit Changes
                </Button>
                <Button variant="text" onClick={clickEdit}>
                  Discard Changes
                </Button>
              </Container>
            ) : (
              <Button
                color="primary"
                variant="contained"
                onClick={clickEdit}
                fullWidth={true}
              >
                Edit
              </Button>
            )}
          </Grid>
          <Grid item>
            <Typography variant="h3">My Trainers</Typography>
          </Grid>
          <Grid item>
            {subscriptions.map((sub, idx) => {
              return (
                <UserAvatar
                  UserImage={sub.Trainer.UserImage}
                  onClick={() =>
                    history.push(`/home/landingpage/${sub.Trainer.id}`)
                  }
                  key={idx}
                />
              );
            })}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={4}>
          <Grid item>
            <Typography variant="h1">Feed</Typography>
          </Grid>
          {content.map((c, idx) => {
            let f = favorites.findIndex((e) => e.Content.id === c.id);
            return (
              <ContentCard
                post={c}
                UserImage={c.Creator.UserImage}
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
        <Grid item container direction="column" xs={4}>
          <Grid item>
            <Typography variant="h1">Favorite Workouts</Typography>
          </Grid>
          {favorites.map((fav, idx) => {
            return (
              <WorkoutCard
                post={fav.Content}
                user={profile}
                favorite={fav}
                segments={fav.Content.Segments}
                clickCallback={onClick}
                favoriteCallback={editFavorite}
                key={idx}
              />
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}

UserFeed.propTypes = {
  user: PropTypes.string,
};

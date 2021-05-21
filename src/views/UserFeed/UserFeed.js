import React, { useEffect, useState } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import PropTypes from "prop-types";
import { Grid, Typography } from "@material-ui/core";
import ContentCard from "../../components/Card/ContentCard";
import WorkoutCard from "../../components/Card/WorkoutCard";
import Banner from "assets/img/banner.jpeg";
import { updateUserProfile } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import EditableTypography from "../../components/EditableTypography/EditableTypography";
import IconButton from "@material-ui/core/IconButton";
import { userRoles } from "../../variables/userRoles";
import {
  GridItem,
  GridContainer,
  StyledContent,
  CustomButton,
  ProfileBox,
  UserFeedBanner,
} from "../../components/StyledComponets/StyledComponets";

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

const deleteUserFavoriteContent = /* GraphQL */ `
  mutation DeleteUserFavoriteContent($input: DeleteUserFavoriteContentInput!) {
    deleteUserFavoriteContent(input: $input) {
      User {
        Favorites {
          items {
            Content {
              id
              ContentName
              Title
              Thumbnail
              createdAt
              Description
              Segments
              owner
            }
            id
          }
        }
      }
    }
  }
`;

const createUserFavoriteContent = /* GraphQL */ `
  mutation CreateUserFavoriteContent($input: CreateUserFavoriteContentInput!) {
    createUserFavoriteContent(input: $input) {
      User {
        Favorites {
          items {
            Content {
              id
              ContentName
              Title
              Thumbnail
              createdAt
              Description
              Segments
              owner
            }
            id
          }
        }
      }
    }
  }
`;
const userProfileQuery = `query GetUserProfile ($id: ID!) {
          getUserProfile(id: $id) {
            Subscriptions {
              items {
                Trainer {
                  Contents {
                    items {
                      id
                      ContentName
                      Description
                      Title
                      createdAt
                      Thumbnail
                      Segments
                      owner
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
                  ContentName
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

const trainerProfileQuery = `query GetUserProfile ($id: ID!) {
          getUserProfile(id: $id) {
            Contents {
              items {
                id
                ContentName
                Description
                Title
                createdAt
                Thumbnail
                Segments
                Creator{
                  UserImage
                }
                owner
              }
            }
            Favorites {
              items {
                Content {
                  id
                  ContentName
                  Title
                  Thumbnail
                  createdAt
                  Description
                  Segments
                  owner
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

export default function UserFeed({ ...props }) {
  const [profile, setProfile] = useState(initialProfileState);
  const [subscriptions, setSubscriptions] = useState([]);
  const [contents, setContents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [edit, setEdit] = useState(false);
  const history = useHistory();

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

  const onClickEditProfile = async (type) => {
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
      ("UserImage" + props.user.id + Date.now()).replace(/[^0-9a-z]/gi, "") +
      "." +
      nameArray[nameArray.length - 1];
    await Storage.put(userImageName, e.target.files[0], {
      contentType: "image/*",
    });
    setProfile({ ...profile, UserImage: userImageName });
  };

  const userQuery = async () => {
    API.graphql(graphqlOperation(userProfileQuery, { id: props.user.id }))
      .then((d) => {
        const { Subscriptions, Favorites, ...p } = d.data.getUserProfile;
        console.log(d.data.getUserProfile);
        setProfile(p);
        setFavorites(Favorites.items);
        setSubscriptions(Subscriptions.items);
      })
      .catch(console.log);
  };

  const trainerQuery = async () => {
    API.graphql(graphqlOperation(trainerProfileQuery, { id: props.user.id }))
      .then((d) => {
        const { Contents, Favorites, ...p } = d.data.getUserProfile;
        setProfile(p);
        setFavorites(Favorites.items);
        setSortedContent(Contents.items);
      })
      .catch(console.log);
  };

  useEffect(() => {
    let temp = [];
    subscriptions.map((sub) => {
      temp = [...temp, ...sub.Trainer.Contents.items];
    });
    setSortedContent(temp);
  }, [subscriptions]);

  useEffect(() => {
    props.user.role === userRoles.STUDENT ? userQuery() : trainerQuery();
  }, []);

  useEffect(() => {
    console.log("sorting...");
    setSortedContent(contents);
  }, [contents.length]);

  const setSortedContent = (contents) => {
    const sorted = contents.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setContents(sorted);
  };

  return (
    <Grid container direction="column">
      <UserFeedBanner URL={Banner} />
      <StyledContent>
        <GridContainer item direction="row">
          <GridContainer item direction="column" xs={12} sm={4}>
            <ProfileBox>
              <GridItem>
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
                        <UserAvatar UserImage={profile.UserImage} />
                      </IconButton>
                    </label>
                  </div>
                ) : (
                  <UserAvatar UserImage={profile.UserImage} />
                )}
              </GridItem>
              <GridContainer item direction="row">
                <EditableTypography
                  variant="h3"
                  label="First Name"
                  text={profile.FirstName}
                  edit={edit}
                  onChange={onChange}
                  id="firstName"
                />
                <EditableTypography
                  variant="h3"
                  label="Last Name"
                  text={profile.LastName}
                  edit={edit}
                  onChange={onChange}
                  id="lastName"
                />
              </GridContainer>
              <GridItem variant="body1" xs={12}>
                <EditableTypography
                  variant="body1"
                  edit={edit}
                  label="Description"
                  fullWidth={true}
                  onChange={onChange}
                  id="description"
                  text={profile.Description}
                />
              </GridItem>
              <GridItem xs={12}>
                {edit ? (
                  <GridItem>
                    <CustomButton
                      fullWidth={true}
                      onClick={() => onClickEditProfile("submit-changes")}
                    >
                      Submit Changes
                    </CustomButton>
                    <CustomButton fullWidth={true} onClick={onClickEditProfile}>
                      Discard Changes
                    </CustomButton>
                  </GridItem>
                ) : (
                  <CustomButton
                    color="primary"
                    variant="contained"
                    onClick={onClickEditProfile}
                    fullWidth={true}
                  >
                    Edit
                  </CustomButton>
                )}
              </GridItem>
            </ProfileBox>
            {props.user.role === userRoles.STUDENT ? (
              <>
                <GridItem>
                  <Typography variant="h3">My Trainers</Typography>
                </GridItem>
                <GridItem container direction="row">
                  {subscriptions.map((sub, idx) => {
                    return (
                      <GridItem key={idx}>
                        <UserAvatar
                          UserImage={sub.Trainer.UserImage}
                          onClick={() =>
                            history.push(`/landingpage/${sub.Trainer.id}`)
                          }
                        />
                      </GridItem>
                    );
                  })}
                </GridItem>
              </>
            ) : (
              <></>
            )}
          </GridContainer>
          <GridContainer item direction="column" xs={12} sm={4}>
            <GridItem>
              <Typography variant="h1">Feed</Typography>
            </GridItem>
            {contents.map((c, idx) => {
              let f = favorites.findIndex((e) => e.Content.id === c.id);
              return (
                <ContentCard
                  post={c}
                  UserImage={c.Creator.UserImage}
                  trainer={props.user}
                  user={profile}
                  favorite={favorites[f]}
                  segments={c.Segments}
                  onCloseEditor={trainerQuery}
                  favoriteCallback={editFavorite}
                  key={idx}
                />
              );
            })}
          </GridContainer>
          <GridContainer item direction="column" xs={12} sm={4}>
            <GridItem>
              <Typography variant="h1">Favorite Workouts</Typography>
            </GridItem>
            {favorites.map((fav, idx) => {
              return (
                <WorkoutCard
                  post={fav.Content}
                  user={profile}
                  favorite={fav}
                  segments={fav.Content.Segments}
                  favoriteCallback={editFavorite}
                  key={idx}
                />
              );
            })}
          </GridContainer>
        </GridContainer>
      </StyledContent>
    </Grid>
  );
}

UserFeed.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
};

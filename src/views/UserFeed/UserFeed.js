import React, { useEffect, useRef, useState } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import PropTypes from "prop-types";
import { Typography, Container } from "@material-ui/core";
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
  CustomButton,
  ProfileBox,
  UserFeedBanner,
} from "../../components/StyledComponets/StyledComponets";
import {
  deleteUserFavoriteContent,
  createUserFavoriteContent,
  userProfileQuery,
  trainerProfileQuery,
} from "../../graphql/UserFeed";
import { onContentByCreatorID } from "../../graphql/subscriptions";

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
  const [contents, setContents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [edit, setEdit] = useState(false);
  const history = useHistory();
  const contentRef = useRef([]);
  contentRef.current = contents;

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

  const unsubscribeAll = () => {
    subscriptions.map((sub) => {
      sub.unsubscribe();
    });
  };

  const pushNewContent = (d) => {
    setContents([d.value.data.onContentByCreatorID].concat(contentRef.current));
  };

  const userQuery = async () => {
    API.graphql(graphqlOperation(userProfileQuery, { id: props.user.id }))
      .then((d) => {
        const {
          Subscriptions: SubsData,
          Favorites,
          ...p
        } = d.data.getUserProfile;
        console.log(d.data.getUserProfile);
        setProfile(p);
        setFavorites(Favorites.items);
        let temp_contents = [];
        SubsData.items.map((sub) => {
          temp_contents = [...temp_contents, ...sub.Trainer.Contents.items];
        });
        setSortedContent(temp_contents);
        return SubsData;
      })
      .catch(console.log);
    return [];
  };

  const userSub = (subs) => {
    let temp_subs = [];
    subs.items.map((sub) => {
      const subscription = API.graphql({
        query: onContentByCreatorID,
        variables: {
          CreatorID: sub.Trainer.id,
        },
      }).subscribe({
        next: pushNewContent,
      });
      temp_subs.push(subscription);
    });
    setSubscriptions(temp_subs);
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

  const trainerSub = () => {
    const subscription = API.graphql({
      query: onContentByCreatorID,
      variables: {
        CreatorID: props.user.id,
      },
    }).subscribe({
      next: pushNewContent,
    });
    setSubscriptions([subscription]);
  };

  useEffect(() => {
    props.user.role === userRoles.STUDENT
      ? userQuery().then((subs) => {
          userSub(subs);
        })
      : trainerQuery().then(trainerSub);
    return unsubscribeAll();
  }, [props.user.id]);

  const setSortedContent = (unsorted) => {
    const sorted = [].concat(unsorted);
    sorted.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setContents(sorted);
  };

  return (
    <>
      <UserFeedBanner url={Banner} />
      <Container maxWidth="xl">
        <GridContainer
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
        >
          <GridContainer item direction="column" xs={12} sm={4}>
            <ProfileBox>
              <GridContainer>
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
              </GridContainer>
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
                  onChange={onChange}
                  id="description"
                  text={profile.Description}
                />
              </GridItem>
              <GridItem xs={12}>
                {edit ? (
                  <GridItem>
                    <CustomButton
                      fullWidth
                      onClick={() => onClickEditProfile("submit-changes")}
                    >
                      Submit Changes
                    </CustomButton>
                    <CustomButton fullWidth onClick={onClickEditProfile}>
                      Discard Changes
                    </CustomButton>
                  </GridItem>
                ) : (
                  <CustomButton
                    color="primary"
                    variant="contained"
                    onClick={onClickEditProfile}
                    size="large"
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
                  trainer={c.Creator}
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
                  trainer={profile}
                  favorite={fav}
                  segments={fav.Content.Segments}
                  favoriteCallback={editFavorite}
                  key={idx}
                />
              );
            })}
          </GridContainer>
        </GridContainer>
      </Container>
    </>
  );
}

UserFeed.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
};

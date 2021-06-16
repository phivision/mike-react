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
  TextA,
  GridTitleFlex,
} from "../../components/StyledComponents/StyledComponents";
import {
  deleteUserFavoriteContent,
  removeDeletedFavoriteContent,
  createUserFavoriteContent,
  userFavoriteQuery,
  userFavoriteIdQuery,
  contentPaginatingQuery,
  userProfileQuery,
} from "../../graphql/UserFeed";
import {
  onContentByCreatorID,
  onDeletionByCreatorID,
} from "../../graphql/subscriptions";
import DataPagination from "components/DataPagination/DataPagination";
import { beforeImageUpload } from "../../utilities/ImagesCompress";

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

export default function UserFeed({ ...props }) {
  const [profile, setProfile] = useState(initialProfileState);
  const [createSub, setCreateSub] = useState([]);
  const [deleteSub, setDeleteSub] = useState([]);
  const [contents, setContents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [edit, setEdit] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const history = useHistory();
  const contentRef = useRef([]);
  const nextTokenRef = useRef("");
  contentRef.current = contents;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const limit = 2;

  const ContentNextTokenQuery = async (nextToken) => {
    const { data } = await API.graphql({
      query: contentPaginatingQuery,
      variables: {
        id: props.user.id,
        limit: limit,
        nextToken: nextToken,
      },
    });
    nextTokenRef.current = data.getUserProfile.Contents.nextToken;
    return data.getUserProfile.Contents;
  };

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
    var avatar = e.target.files[0];
    let newAvatr;
    const nameArray = e.target.files[0].name.split(".");
    const userImageName =
      ("UserImage" + props.user.id + Date.now()).replace(/[^0-9a-z]/gi, "") +
      "." +
      nameArray[nameArray.length - 1];
    //if > 100kb, then compress avatar image to small size
    console.log("original Avatar size", avatar.size / 1024);
    if (avatar.size > 1024 * 1024 * 0.1) {
      newAvatr = await beforeImageUpload(avatar, 150);
      console.log("compressed Avatar size", newAvatr.size / 1024);
    } else {
      newAvatr = avatar;
    }
    console.log("newAvatr", newAvatr);
    await Storage.put(userImageName, newAvatr, {
      contentType: "image/*",
    });
    setProfile({ ...profile, UserImage: userImageName });
  };

  const unsubscribeAll = () => {
    createSub.map((sub) => {
      sub.unsubscribe();
    });
    deleteSub.map((sub) => {
      sub.unsubscribe();
    });
  };

  const pushNewContent = (d) => {
    console.log("d is", d);
    setContents([d.value.data.onContentByCreatorID].concat(contentRef.current));
  };

  const pushDeleteContent = (d) => {
    const contentMoreDel = contentRef.current.filter(function (item) {
      return item.id !== d.value.data.onDeletionByCreatorID.id;
    });
    // console.log("new content array after deletion", contentMoreDel);
    setContents(contentMoreDel);
  };

  const userQuery = async () => {
    const d = await API.graphql(
      graphqlOperation(userProfileQuery, { id: props.user.id, limit: limit })
    ).catch(console.log);
    const { Subscriptions: SubsData, ...p } = d.data.getUserProfile;
    setProfile(p);
    let temp_contents = [];
    let temp_trainers = [];
    SubsData.items.map((sub) => {
      const { Contents: contentItems, ...trainerProfile } = sub.Trainer;
      temp_contents = [...temp_contents, ...contentItems.items];
      temp_trainers = [...temp_trainers, trainerProfile];
    });
    setSortedContent(temp_contents);
    setTrainers(temp_trainers);
    return SubsData;
  };

  const userFavorite = async () => {
    API.graphql(graphqlOperation(userFavoriteQuery, { id: props.user.id }))
      .then((d) => {
        setFavorites(d.data.getUserProfile.Favorites.items);
      })
      .catch((d) => {
        let error_indexes = [];
        d.errors.map((error) => {
          if (error.path[3]) {
            error_indexes.push(error.path[3]);
          }
        });
        // get favorite id
        API.graphql(
          graphqlOperation(userFavoriteIdQuery, { id: props.user.id })
        ).then((d) => {
          // remove favorite relationship for deleted items
          d.data.getUserProfile.Favorites.items.map((data, idx) => {
            if (error_indexes.includes(idx)) {
              API.graphql(
                graphqlOperation(removeDeletedFavoriteContent, {
                  input: { id: data.id },
                })
              ).catch(console.log);
            }
          });
        });
        // reset the favorites
        const fixed_favorites = d.data.getUserProfile.Favorites.items.filter(
          (item) => !!item
        );
        setFavorites(fixed_favorites);
      });
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
    setCreateSub(temp_subs);
  };

  const trainerQuery = async () => {
    API.graphql(
      graphqlOperation(contentPaginatingQuery, {
        id: props.user.id,
        limit: limit,
      })
    )
      .then((d) => {
        const { Contents, ...p } = d.data.getUserProfile;
        setProfile(p);
        setSortedContent(Contents.items);
        if (!nextTokenRef.current) {
          nextTokenRef.current = Contents.nextToken;
        }
      })
      .catch(console.log);
  };

  const trainerSub = () => {
    const createSub = API.graphql({
      query: onContentByCreatorID,
      variables: {
        CreatorID: props.user.id,
      },
    }).subscribe({
      next: pushNewContent,
    });
    const deleteSub = API.graphql({
      query: onDeletionByCreatorID,
      variables: {
        CreatorID: props.user.id,
      },
    }).subscribe({
      next: pushDeleteContent,
    });
    setCreateSub([createSub]);
    setDeleteSub([deleteSub]);
  };

  useEffect(() => {
    if (props.user.role !== userRoles.UNKNOWN) {
      props.user.role === userRoles.STUDENT
        ? userQuery().then((subs) => {
            userSub(subs);
          })
        : trainerQuery().then(trainerSub);
      return unsubscribeAll();
    }
  }, [props.user.id]);

  useEffect(() => {
    if (props.user.role !== userRoles.UNKNOWN) {
      userFavorite();
    }
  }, [props.user.id]);

  const setSortedContent = (unsorted) => {
    const sorted = [].concat(unsorted);
    sorted.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setContents(sorted);
  };

  const handleContentMore = () => {
    ContentNextTokenQuery(nextTokenRef.current).then((newContents) => {
      let newArr = [];
      let arrId = [];
      let temp = contentRef.current;
      temp.push.apply(temp, newContents.items);
      for (const item of temp) {
        // push into the new list only if it is not contained in the existing list
        if (arrId.indexOf(item.id) === -1) {
          arrId.push(item.id);
          newArr.push(item);
        }
      }
      setSortedContent(newArr);
    });
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
                  multiline="true"
                  text={profile.Description}
                />
              </GridItem>
              <GridItem xs={12}>
                {edit ? (
                  <GridItem>
                    <CustomButton
                      variant="contained"
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
                  {trainers.map((trainer, idx) => {
                    return (
                      <GridItem key={idx}>
                        <UserAvatar
                          UserImage={trainer.UserImage}
                          onClick={() =>
                            history.push(`/landingpage/${trainer.id}`)
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
            <GridTitleFlex>
              <Typography variant="h2">Feed</Typography>
              <TextA
                size="20px"
                onClick={() => {
                  handleContentMore();
                }}
              >
                More
              </TextA>
            </GridTitleFlex>
            {contents.map((c, idx) => {
              let f = favorites.findIndex((e) => e.Content.id === c.id);
              return (
                <ContentCard
                  post={c}
                  trainer={c.Creator}
                  user={profile}
                  favorite={favorites[f]}
                  segments={c.Segments}
                  favoriteCallback={editFavorite}
                  key={idx}
                />
              );
            })}
          </GridContainer>
          <GridContainer item direction="column" xs={12} sm={4}>
            <GridItem>
              <Typography variant="h2">Favorite Workouts</Typography>
            </GridItem>
            <GridItem>
              {(rowsPerPage > 0
                ? favorites.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : favorites
              ).map((fav, idx) => {
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
              <DataPagination
                length={favorites.length}
                page={page}
                rowsPerPage={rowsPerPage}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
              />
            </GridItem>
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

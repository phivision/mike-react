import React, { useEffect, useRef, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { Typography, Container } from "@material-ui/core";
import ContentCard from "../../components/Card/ContentCard";
import WorkoutCard from "../../components/Card/WorkoutCard";
import Banner from "assets/img/banner.jpeg";
import { userRoles } from "../../variables/userRoles";
import {
  GridItem,
  GridContainer,
  UserFeedBanner,
  TextA,
  GridTitleFlex,
  FloatBox,
  IconStyle,
} from "../../components/StyledComponents/StyledComponents";
import {
  deleteUserFavoriteContent,
  removeDeletedFavoriteContent,
  createUserFavoriteContent,
  userFavoriteQuery,
  userFavoriteIdQuery,
  contentPaginatingQuery,
  userSubscriptionQuery,
} from "../../graphql/UserFeed";
import {
  onContentByCreatorID,
  onUpdateByCreatorID,
  onDeletionByCreatorID,
} from "../../graphql/subscriptions";
import DataPagination from "components/DataPagination/DataPagination";
import UserProfile from "../../components/UserProfile/UserProfile";
import MessageIcon from "@material-ui/icons/Message";
import ChatPopUp from "../../components/Chat/ChatPopUp";
// import Badge from "@material-ui/core/Badge";

export default function UserFeed(props) {
  const [createSub, setCreateSub] = useState([]);
  const [deleteSub, setDeleteSub] = useState([]);
  const [updateSub, setUpdateSub] = useState([]);
  const [contents, setContents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const contentRef = useRef([]);
  const nextTokenRef = useRef("");
  contentRef.current = contents;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const limit = 2;
  const [openChat, setOpenChat] = useState(false);
  // const [allMessageLength, setAllMessageLength] = useState(0);

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
            userFavoriteContentUserId: props.user.id,
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

  const unsubscribeAll = () => {
    createSub.map((sub) => {
      sub.unsubscribe();
    });
    deleteSub.map((sub) => {
      sub.unsubscribe();
    });
    updateSub.map((sub) => {
      sub.unsubscribe();
    });
  };

  const pushNewContent = (d) => {
    console.log("d is", d);
    setContents([d.value.data.onContentByCreatorID].concat(contentRef.current));
  };

  const removeDeleteContent = (d) => {
    const filteredContents = contentRef.current.filter(function (item) {
      return item.id !== d.value.data.onDeletionByCreatorID.id;
    });
    // console.log("new content array after deletion", contentMoreDel);
    setContents(filteredContents);
  };

  const updateCurrentContent = (d) => {
    const currentContents = contentRef.current;
    let newContents = [];
    currentContents.map((content) => {
      if (content.id === d.value.data.onUpdateByCreatorID.id) {
        newContents.push(d.value.data.onUpdateByCreatorID);
      } else {
        newContents.push(content);
      }
    });
    setContents(newContents);
  };

  const subQuery = async () => {
    const d = await API.graphql(
      graphqlOperation(userSubscriptionQuery, {
        id: props.user.id,
      })
    ).catch(console.log);
    const SubsData = d.data.getUserProfile.Subscriptions;
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
    let tempCreateSub = [];
    let tempDeleteSub = [];
    let tempUpdateSub = [];
    subs.items.map((sub) => {
      const createSub = API.graphql({
        query: onContentByCreatorID,
        variables: {
          CreatorID: sub.Trainer.id,
        },
      }).subscribe({
        next: pushNewContent,
      });
      const deleteSub = API.graphql({
        query: onDeletionByCreatorID,
        variables: {
          CreatorID: sub.Trainer.id,
        },
      }).subscribe({
        next: removeDeleteContent,
      });
      const updateSub = API.graphql({
        query: onUpdateByCreatorID,
        variables: {
          CreatorID: sub.Trainer.id,
        },
      }).subscribe({
        next: updateCurrentContent,
      });
      tempCreateSub.push(createSub);
      tempDeleteSub.push(deleteSub);
      tempUpdateSub.push(updateSub);
    });
    setCreateSub(tempCreateSub);
    setDeleteSub(tempDeleteSub);
    setUpdateSub(tempUpdateSub);
  };

  const contentQuery = async () => {
    API.graphql(
      graphqlOperation(contentPaginatingQuery, {
        id: props.user.id,
        limit: limit,
      })
    )
      .then((d) => {
        const Contents = d.data.getUserProfile.Contents;
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
      next: removeDeleteContent,
    });
    const updateSub = API.graphql({
      query: onUpdateByCreatorID,
      variables: {
        CreatorID: props.user.id,
      },
    }).subscribe({
      next: updateCurrentContent,
    });
    setCreateSub([createSub]);
    setDeleteSub([deleteSub]);
    setUpdateSub([updateSub]);
  };

  useEffect(() => {
    if (props.user.role !== userRoles.UNKNOWN) {
      props.user.role === userRoles.STUDENT
        ? subQuery().then((subs) => {
            userSub(subs);
          })
        : contentQuery().then(trainerSub);
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

  const handleClickOpenChat = () => {
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
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
          {props.user.role === userRoles.STUDENT ? (
            <UserProfile user={props.user} trainers={trainers} />
          ) : (
            <UserProfile user={props.user} />
          )}
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
                  user={{ id: props.user.id }}
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
      <FloatBox>
        <IconStyle
          onClick={() => {
            handleClickOpenChat();
          }}
        >
          {/* <Badge badgeContent={allMessageLength} color="primary"> */}
          <MessageIcon />
          {/* </Badge> */}
        </IconStyle>
      </FloatBox>
      <ChatPopUp
        openChat={openChat}
        handleCloseChat={handleCloseChat}
        userData={props.user}
        // setAllMessageLength={setAllMessageLength}
        // allMessageLength={allMessageLength}
      />
    </>
  );
}

UserFeed.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
};

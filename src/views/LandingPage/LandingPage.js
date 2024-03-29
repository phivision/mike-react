import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { Dialog, Typography, Container } from "@material-ui/core";
import ContentCard from "../../components/Card/ContentCard";
import WorkoutCard from "../../components/Card/WorkoutCard";
import Banner from "assets/banner.jpeg";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import { useHistory } from "react-router-dom";
import Checkout from "../../components/Checkout/Checkout";
import {
  GridItem,
  GridContainer,
  CustomButton,
  ProfileBox,
  UserFeedBanner,
  TextA,
  GridTitleFlex,
} from "../../components/StyledComponents/StyledComponents";
import DataPagination from "components/DataPagination/DataPagination";
import {
  profileLimitQuery,
  contentPaginatingQuery,
} from "../../graphql/UserFeed";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";

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

export default function LandingPage({ ...props }) {
  const [profile, setProfile] = useState(initialProfileState);
  const [content, setContent] = useState([]);
  const [price, setPrice] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [subscribed, setSubscribed] = useState(false);
  const [contentAll, setContentAll] = useState([]);
  const [contentMore, setContentMore] = useState([]);
  const [id, setId] = useState("");
  const limit = 2;
  let nextToken = "";
  const [isVerified, setVerified] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const ContentNextTokenQuery = async (nextToken) => {
    const { data } = await API.graphql({
      query: contentPaginatingQuery,
      variables: {
        id: id,
        limit: limit,
        nextToken: nextToken,
      },
    });
    setContentAll(data.getUserProfile.Contents);
  };

  const userQuery = async () => {
    const d = await API.graphql(
      graphqlOperation(profileLimitQuery, {
        id: id,
        limit: limit,
      })
    );

    const { Contents, IsVerified, Favorites, ...p } = d.data.getUserProfile;
    setProfile(p);
    setVerified(IsVerified);
    setFavorites(Favorites.items);
    setContent(Contents.items);
    if (!nextToken) {
      nextToken = Contents.nextToken;
      ContentNextTokenQuery(nextToken);
    }

    return d;
  };

  const getPrice = async (id) => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: id,
      },
      response: true,
    };

    const res = await API.post(
      "stripeAPI",
      "/stripe/api/trainer/get/price",
      myInit
    );

    setPrice(res.data.data[0].unit_amount / 100);

    return res;
  };

  const checkSubscription = async (userID, trainerID) => {
    const query = /* GraphQL */ `
      query GetUserProfile($id: ID!) {
        getUserProfile(id: $id) {
          Subscriptions {
            items {
              Trainer {
                id
              }
            }
          }
        }
      }
    `;

    const d = await API.graphql(graphqlOperation(query, { id: userID }));

    d.data.getUserProfile.Subscriptions.items.forEach((sub) => {
      if (sub.Trainer.id === trainerID) {
        setSubscribed(true);
        return true;
      }
    });

    return false;
  };

  const createSubscription = (paymentMethodId) => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        trainerID: id,
        customerID: props.user.id,
        paymentMethodID: paymentMethodId,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/create/subscription", myInit)
      .then((res) => {
        if (res.error) {
          setSnackbarMessage("Subscription unsuccessful");
        } else {
          setSnackbarMessage("Subscription successful.");
        }
      })
      .catch(() => {
        setSnackbarMessage("Subscription unsuccessful");
      });
  };

  const onClick = () => {
    if (props.user.id) {
      setOpenCheckout(true);
    } else {
      history.push({
        pathname: "/signin",
        state: { next: props.location.pathname },
      });
    }
  };

  useEffect(() => {
    if (props.match.params.id.length < 36) {
      const urlQuery = `query MyQuery($LandingURL: String!) {
        profilesByURL(LandingURL: $LandingURL) {
          items {
            id
          }
        }
      }`;

      API.graphql(
        graphqlOperation(urlQuery, { LandingURL: props.match.params.id })
      )
        .then((d) => {
          setId(d.data.profilesByURL.items[0].id);
        })
        .catch(() => {
          history.push("/404");
        });
    } else {
      setId(props.match.params.id);
    }
  }, [props.match.params.id]);

  const handleContentMore = () => {
    nextToken = contentAll.nextToken;
    ContentNextTokenQuery(nextToken);
    var newArr = [];
    var arrId = [];
    var temp = contentMore;
    temp.push.apply(temp, contentAll.items);
    for (var item of temp) {
      if (arrId.indexOf(item["id"]) === -1) {
        arrId.push(item["id"]);
        newArr.push(item);
      }
    }
    setContentMore(newArr);
  };

  if (contentMore.length < 1 && content.length > 0) {
    setContentMore(content);
  }

  useEffect(() => {
    if (id) {
      if (props.user.id) {
        Promise.all([
          getPrice(id),
          userQuery(),
          checkSubscription(props.user.id, id),
        ]).then(() => setLoaded(true));
      } else {
        Promise.all([getPrice(id), userQuery()]).then(() => setLoaded(true));
      }
    }
  }, [props.user.id, id]);

  return (
    <>
      {loaded ? (
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
                  <GridItem>
                    <UserAvatar UserImage={profile.UserImage} />
                  </GridItem>
                  <GridItem>
                    <Typography variant="h3">
                      {profile.FirstName + " " + profile.LastName}
                    </Typography>
                  </GridItem>
                  <GridItem variant="body1">{profile.Description}</GridItem>
                  <GridItem>
                    {isVerified && (
                      <>
                        {subscribed ? (
                          <CustomButton variant="outlined" disabled>
                            Already Subscribed
                          </CustomButton>
                        ) : (
                          <CustomButton variant="contained" onClick={onClick}>
                            {"Subscribe for $" + price + " per month"}
                          </CustomButton>
                        )}
                      </>
                    )}
                  </GridItem>
                </ProfileBox>
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
                {contentMore.map((c, idx) => {
                  let f = favorites.findIndex(
                    (e) => e.Content.id === content.id
                  );
                  return (
                    <ContentCard
                      post={c}
                      trainer={profile}
                      user={props.user}
                      favorite={favorites[f]}
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
            <Dialog
              onClose={() => setOpenCheckout(false)}
              fullWidth
              aria-labelledby="checkout-dialog"
              open={openCheckout}
            >
              <Checkout
                user={props.user}
                paymentMethodCallback={createSubscription}
                buttonTitle="Subscribe"
                checkExistingPaymentMethod={true}
              />
            </Dialog>
          </Container>
          <CustomSnackbar
            message={snackbarMessage}
            setMessage={setSnackbarMessage}
          />
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
}

LandingPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      limit: PropTypes.number,
      nextToken: PropTypes.string,
    }),
  }),
  user: PropTypes.shape({ id: PropTypes.string }),
  location: PropTypes.shape({ pathname: PropTypes.string }),
};

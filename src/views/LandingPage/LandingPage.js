import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { Dialog, Grid, Snackbar, Typography } from "@material-ui/core";
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
import { useHistory } from "react-router-dom";
import Checkout from "../../components/Checkout/Checkout";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const history = useHistory();

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
          LastName
          FirstName
          Weight
          Description
          Favorites {
            items {
              id
              Content {
                id
                Title
                Thumbnail
                createdAt
                Description
                Segments
                owner
              }
            }
            nextToken
          }
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
              owner
            }
            nextToken
          }
        }
      }
    `;
    API.graphql(graphqlOperation(query, { id: props.match.params.id }))
      .then((d) => {
        const { Contents, Favorites, ...p } = d.data.getUserProfile;
        setProfile(p);
        setFavorites(Favorites.items);
        setContent(Contents.items);
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

  const createSubscription = (paymentMethodId) => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        trainerID: props.match.params.id,
        customerID: props.user.id,
        paymentMethodID: paymentMethodId,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/create/subscription", myInit).then(
      (res) => {
        if (res.error) {
          checkoutError(res.error);
        } else {
          checkoutSuccess();
        }
      }
    );
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const checkoutSuccess = () => {
    handleCloseCheckout();
    setSnackbarMessage("Subscription successful.");
    setOpenSnackbar(true);
  };

  const checkoutError = (e) => {
    console.log(e);
    setSnackbarMessage("Subscription unsuccessful. Please try again.");
    setOpenSnackbar(true);
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

  const handleCloseCheckout = () => {
    setOpenCheckout(false);
  };

  //TODO: Add open content callback
  const openContent = (id) => {
    console.log(id);
  };

  useEffect(() => {
    getPrice(props.match.params.id);
    userQuery();
  }, [props.match.params.id]);

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
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
            {content.map((c, idx) => {
              let f = favorites.findIndex((e) => e.Content.id === content.id);
              return (
                <ContentCard
                  post={c}
                  UserImage={c.Creator.UserImage}
                  user={profile}
                  favorite={favorites[f]}
                  segments={c.Segments}
                  clickCallback={openContent}
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
              return (
                <WorkoutCard
                  post={fav.Content}
                  user={profile}
                  favorite={fav}
                  segments={fav.Content.Segments}
                  clickCallback={openContent}
                  favoriteCallback={editFavorite}
                  key={idx}
                />
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        onClose={handleCloseCheckout}
        fullWidth
        aria-labelledby="checkout-dialog"
        open={openCheckout}
      >
        <Checkout
          errorCallback={checkoutError}
          paymentMethodCallback={createSubscription}
          buttonTitle="Subscribe"
        />
      </Dialog>
    </>
  );
}

LandingPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
  user: PropTypes.shape({ id: PropTypes.string }),
  location: PropTypes.shape({ pathname: PropTypes.string }),
};

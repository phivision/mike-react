import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { Dialog, Snackbar, Typography, Container } from "@material-ui/core";
import ContentCard from "../../components/Card/ContentCard";
import WorkoutCard from "../../components/Card/WorkoutCard";
import Banner from "assets/img/banner.jpeg";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import { useHistory } from "react-router-dom";
import Checkout from "../../components/Checkout/Checkout";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
  GridItem,
  GridContainer,
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

  useEffect(() => {
    getPrice(props.match.params.id);
    userQuery();
  }, [props.match.params.id]);

  return (
    <>
      <UserFeedBanner url={Banner} />
      <Container maxWidth="xl">
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
        <GridContainer
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
        >
          <GridContainer item direction="column" xs={12} sm={4}>
            <ProfileBox>
              <GridItem>
                <UserAvatar
                  // style={{
                  //   width: "200px",
                  //   height: "200px",
                  // }}
                  UserImage={profile.UserImage}
                />
              </GridItem>
              <GridItem>
                <Typography variant="h3">
                  {profile.FirstName + " " + profile.LastName}
                </Typography>
              </GridItem>
              <GridItem variant="body1">{profile.Description}</GridItem>
              <GridItem>
                <CustomButton onClick={onClick}>
                  {"Join for $" + price + " per month"}
                </CustomButton>
              </GridItem>
            </ProfileBox>
          </GridContainer>
          <GridContainer item direction="column" xs={12} sm={4}>
            <GridItem>
              <Typography variant="h1">Feed</Typography>
            </GridItem>
            {content.map((c, idx) => {
              let f = favorites.findIndex((e) => e.Content.id === content.id);
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
              <Typography variant="h1">Favorite Workouts</Typography>
            </GridItem>
            {favorites.map((fav, idx) => {
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
          </GridContainer>
        </GridContainer>
        <Dialog
          onClose={handleCloseCheckout}
          fullWidth
          aria-labelledby="checkout-dialog"
          open={openCheckout}
        >
          <Checkout
            errorCallback={checkoutError}
            user={props.user}
            paymentMethodCallback={createSubscription}
            buttonTitle="Subscribe"
          />
        </Dialog>
      </Container>
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

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Dialog } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
// local variables
import { userRoles } from "variables/userRoles";
// local components
import ActiveSubscriptions from "../../components/Settings/ActiveSubscriptions";
// amplify components
import { API, Auth, graphqlOperation } from "aws-amplify";
import PaymentMethod from "../../components/PaymentMethod/PaymentMethod";
import IconButton from "@material-ui/core/IconButton";
import Checkout from "../../components/Checkout/Checkout";
import TrainerPrice from "../../components/Settings/TrainerPrice";
import {
  CustomButton,
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import EditURL from "../../components/Settings/EditURL";
import CashOut from "../../components/Settings/CashOut";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";

const getUserSettings = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      Email
      StripeID
      IsVerified
      LandingURL
      TokenBalance
      TokenPrice
      Subscriptions {
        items {
          Trainer {
            UserImage
            LastName
            FirstName
          }
          ExpireDate
          StripeID
          id
          CancelAtPeriodEnd
        }
      }
    }
  }
`;

export default function Settings(props) {
  const [email, setEmail] = useState("");
  const [url, setURL] = useState("");
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState("");
  const [trainers, setTrainers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isVerified, setVerified] = useState(true);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [prices, setPrices] = useState([]);
  const [balance, setBalance] = useState();

  const history = useHistory();
  let mounted = true;

  const handleOpenPassword = () => {
    history.push({ pathname: "/reset", state: { next: window.location.href } });
  };

  const userRole = props.user.role;

  const fetchSettings = () => {
    API.graphql(graphqlOperation(getUserSettings, { id: props.user.id }))
      .then((userSettingData) => {
        setBalance(userSettingData.data.getUserProfile.TokenBalance);
        setEmail(userSettingData.data.getUserProfile.Email);
        setURL(userSettingData.data.getUserProfile.LandingURL);
        if (userRole === userRoles.STUDENT) {
          setTrainers(userSettingData.data.getUserProfile.Subscriptions.items);
        }
        if (userRole === userRoles.TRAINER) {
          setVerified(userSettingData.data.getUserProfile.IsVerified);
        }
      })
      .catch(console.log);
  };

  const fetchDefaultPaymentMethod = () => {
    if (props.user.role === userRoles.STUDENT) {
      const myInit = {
        headers: {}, // AWS-IAM authorization if using empty headers
        body: {
          id: props.user.id,
        },
        response: true,
      };
      console.log("Requesting: " + props.user.id);
      API.post("stripeAPI", "/stripe/api/user/get/customer", myInit)
        .then((d) => {
          setDefaultPaymentMethod(
            d.data.invoice_settings.default_payment_method
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deletePaymentMethod = (id) => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        paymentMethodID: id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/delete/payment", myInit)
      .then(() => {
        setSnackbarMessage("Successfully detached payment method");
        fetchPaymentMethod();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addPaymentMethod = (paymentMethodID) => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user.id,
        paymentMethodID: paymentMethodID,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/create/payment", myInit)
      .then(() => {
        setSnackbarMessage("Successfully created payment method");
        setOpenCheckout(false);
        fetchPaymentMethod();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeDefaultPaymentMethod = (paymentMethodID) => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user.id,
        paymentMethodID: paymentMethodID,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/update/defaultpayment", myInit)
      .then(() => {
        setSnackbarMessage("Successfully updated payment method");
        setSnackbarMessage(false);
        if (mounted) {
          setDefaultPaymentMethod(paymentMethodID);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchPaymentMethod = () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user.id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/get/payment", myInit)
      .then((d) => {
        if (mounted) {
          setPaymentMethods(d.data.data);
        }
      })
      .catch(console.log);
  };

  const signOut = () => {
    Auth.signOut()
      .then(() => {
        console.log("Successfully signed out.");
        history.push("/");
      })
      .catch(console.log);
  };

  const onboard = async () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user.id,
        refreshUrl: window.location.href,
        returnUrl: window.location.href,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/link/onboarding", myInit)
      .then((res) => {
        window.location.href = res.data.AccountLink;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = async () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user.id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/link/login", myInit)
      .then((res) => {
        window.location.href = res.data.AccountLink;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPrices = () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user.id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/get/price", myInit)
      .then((res) => {
        setPrices(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changePrice = (p) => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user.id,
        newPrice: p,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/update/price", myInit)
      .then(() => {
        setSnackbarMessage("Price Updated Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (props.user.role === userRoles.TRAINER && !isVerified) {
      setSnackbarMessage(
        "Please login to Stripe in the settings to complete account verification."
      );
    }
  }, [isVerified]);

  useEffect(() => {
    const sorted = [...paymentMethods].sort((a, b) => {
      if (a.id === defaultPaymentMethod) {
        return -1;
      }
      if (b.id === defaultPaymentMethod) {
        return 1;
      }
      return 0;
    });
    setPaymentMethods(sorted);
  }, [defaultPaymentMethod, paymentMethods.length]);

  useEffect(() => {
    if (props.user.id) {
      if (userRole === userRoles.TRAINER) {
        getPrices();
      }
      fetchSettings();
    }
  }, [props.user.id, setPrices, setTrainers]);

  useEffect(() => {
    if (props.user.id) {
      if (props.user.role === userRoles.STUDENT) {
        fetchDefaultPaymentMethod();
        fetchPaymentMethod();
      }
    }
    return () => {
      mounted = false;
    };
  }, [props.user.id, setDefaultPaymentMethod, setPaymentMethods]);

  return (
    <>
      <CustomContainer>
        <Grid direction="column" container>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            style={{ padding: "10px" }}
          >
            <Grid item xs>
              <TextStyle variant="h2">Account</TextStyle>
            </Grid>
            <Grid
              item
              xs
              container
              direction="row"
              alignItems="center"
              justify="flex-end"
            >
              <Grid item>
                <TextStyle variant="body1">{email}</TextStyle>
              </Grid>
              <Grid item>
                <CustomButton onClick={signOut}>Sign out</CustomButton>
              </Grid>
            </Grid>
          </Grid>
          <Divider light />
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            style={{ padding: "10px" }}
          >
            <Grid item xs>
              <TextStyle variant="h3">
                {userRole === userRoles.STUDENT
                  ? "Membership and Billing"
                  : "Account and Billing"}
              </TextStyle>
            </Grid>
            <Grid item container xs direction="column">
              <Grid
                item
                container
                xs
                direction="row"
                justify="space-between"
                alignItems="center"
                style={{ padding: "10px" }}
              >
                <Grid item>Password: ********</Grid>
                <Grid item>
                  <CustomButton onClick={handleOpenPassword}>
                    Change password
                  </CustomButton>
                </Grid>
              </Grid>
              <Divider light />
              {userRole === userRoles.STUDENT ? (
                <Grid
                  item
                  container
                  direction="column"
                  style={{ padding: "10px" }}
                >
                  {paymentMethods.map((p, idx) => {
                    let isDefault = p.id === defaultPaymentMethod;
                    return (
                      <Grid item key={idx}>
                        <PaymentMethod
                          isDefault={isDefault}
                          PaymentMethod={p}
                          deleteCallback={deletePaymentMethod}
                          defaultCallback={makeDefaultPaymentMethod}
                          key={idx}
                        />
                      </Grid>
                    );
                  })}
                  <Grid item>
                    <IconButton onClick={() => setOpenCheckout(true)}>
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ) : (
                <Grid item style={{ padding: "10px" }}>
                  <CustomButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {
                      isVerified ? login() : onboard();
                    }}
                  >
                    {isVerified
                      ? "Manage Billing on Stripe"
                      : "Verify Account on Stripe"}
                  </CustomButton>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Divider light />
          {userRole === userRoles.STUDENT ? (
            <ActiveSubscriptions trainers={trainers} />
          ) : (
            isVerified && (
              <>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="space-between"
                  style={{ padding: "10px" }}
                >
                  <EditURL url={url} user={props.user} />
                </Grid>
                <Divider light />
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  justify="space-between"
                  style={{ padding: "10px" }}
                >
                  <Grid item xs>
                    <TextStyle variant="h3">Pricing Tiers</TextStyle>
                  </Grid>
                  <Grid item xs container direction="column">
                    {prices.map((p, idx) => (
                      <Grid item key={idx}>
                        <TrainerPrice
                          key={idx}
                          price={p.unit_amount}
                          changePrice={changePrice}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Divider light />
                <CashOut
                  balance={balance}
                  changeBalance={setBalance}
                  user={props.user}
                />
              </>
            )
          )}
        </Grid>
      </CustomContainer>
      <Dialog
        onClose={() => setOpenCheckout(false)}
        fullWidth
        aria-labelledby="checkout-dialog"
        open={openCheckout}
      >
        <Checkout
          paymentMethodCallback={addPaymentMethod}
          buttonTitle="Add"
          user={props.user}
          checkExistingPaymentMethod={false}
        />
      </Dialog>
      <CustomSnackbar
        setMessage={setSnackbarMessage}
        message={snackbarMessage}
      />
    </>
  );
}

Settings.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
};

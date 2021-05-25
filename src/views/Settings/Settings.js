import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Dialog, Snackbar, Typography } from "@material-ui/core";
import ChangePassword from "../../components/Settings/ChangePassword";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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
import CloseIcon from "@material-ui/icons/Close";
import TrainerPrice from "../../components/Settings/TrainerPrice";
import { SettingTableContainer } from "../../components/StyledComponets/StyledComponets";

const getUserSettings = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      Email
      StripeID
      Subscriptions {
        items {
          Trainer {
            UserImage
            LastName
            FirstName
          }
          ExpireDate
          StripeID
        }
      }
    }
  }
`;

export default function Settings(props) {
  const [email, setEmail] = useState("");
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState("");
  const [trainers, setTrainers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isVerified, setVerified] = useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [prices, setPrices] = useState([]);

  const handleOpenPassword = () => {
    setOpenDialog(true);
  };

  const handleClosePassword = () => {
    setOpenDialog(false);
  };

  const userRole = props.user.role;

  const PasswordDialog = () => {
    return (
      <Dialog open={openDialog} onClose={handleClosePassword}>
        <div>
          <ChangePassword />
        </div>
      </Dialog>
    );
  };

  async function fetchSettings() {
    const userSettingData = await API.graphql(
      graphqlOperation(getUserSettings, { id: props.user.id })
    );
    setEmail(userSettingData.data.getUserProfile.Email);
    return userSettingData.data.getUserProfile.Subscriptions.items;
  }

  const fetchDefaultPaymentMethod = () => {
    if (props.user.role === userRoles.STUDENT) {
      const myInit = {
        headers: {}, // AWS-IAM authorization if using empty headers
        body: {
          id: props.user.id,
        },
        response: true,
      };

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
        checkoutSuccess("Successfully detached payment method");
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
        checkoutSuccess("Successfully created payment method");
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
        checkoutSuccess("Successfully updated payment method");
        setDefaultPaymentMethod(paymentMethodID);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleCloseCheckout = () => {
    setOpenCheckout(false);
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
        setPaymentMethods(d.data.data);
      })
      .catch(console.log);
  };

  const handleOpenCheckout = () => {
    setOpenCheckout(true);
  };

  const signOut = () => {
    Auth.signOut()
      .then(() => console.log("Successfully signed out."))
      .catch(console.log);
  };

  const checkoutError = () => {
    setSnackbarMessage("Adding payment method unsuccessful. Please try again.");
    setOpenSnackbar(true);
  };

  const checkoutSuccess = (m) => {
    handleCloseCheckout();
    setSnackbarMessage(m);
    setOpenSnackbar(true);
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

  const checkVerification = () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user.id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/get/account", myInit)
      .then((d) => {
        setVerified(d.data.details_submitted);
      })
      .catch(console.log);
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
        setOpenSnackbar(true);
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
      setOpenSnackbar(true);
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
    checkVerification();
    getPrices();
    fetchSettings().then((subs) => {
      if (userRole === userRoles.STUDENT) {
        setTrainers(subs);
      }
    });
    if (props.user.role === userRoles.STUDENT) {
      fetchDefaultPaymentMethod();
      fetchPaymentMethod();
    }
  }, [props.user.id]);

  return (
    <SettingTableContainer>
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
      <Table aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="left" rowSpan={3}>
              <Typography variant="h1">Account</Typography>
            </TableCell>
            <TableCell align="left">
              <Typography variant="body1">{email}</Typography>
            </TableCell>
            <TableCell align="right">
              <Button onClick={signOut}>Sign out</Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell rowSpan={4}>
              <Typography variant="h3">
                {userRole === userRoles.STUDENT
                  ? "Membership and Billing"
                  : "Account and Billing"}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Password: ********</TableCell>
            <TableCell align="right">
              <Button onClick={handleOpenPassword}>Change password</Button>
            </TableCell>
          </TableRow>
          {userRole === userRoles.STUDENT ? (
            <TableRow>
              <TableCell align="left">
                {paymentMethods.map((p, idx) => {
                  let isDefault = p.id === defaultPaymentMethod;
                  return (
                    <PaymentMethod
                      isDefault={isDefault}
                      PaymentMethod={p}
                      deleteCallback={deletePaymentMethod}
                      defaultCallback={makeDefaultPaymentMethod}
                      key={idx}
                    />
                  );
                })}
                <IconButton onClick={handleOpenCheckout}>
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell>
                <Button
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
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {userRole === userRoles.STUDENT ? (
          <ActiveSubscriptions trainers={trainers} user={props.user.id} />
        ) : (
          <TableRow>
            <TableCell align="left">
              <Typography variant="h3">Pricing Tiers</Typography>
            </TableCell>
            {prices.map((p, idx) => (
              <TrainerPrice
                key={idx}
                price={p.unit_amount}
                changePrice={changePrice}
              />
            ))}
          </TableRow>
        )}
      </Table>
      <PasswordDialog />
      <Dialog
        onClose={handleCloseCheckout}
        fullWidth
        aria-labelledby="checkout-dialog"
        open={openCheckout}
      >
        <Checkout
          errorCallback={checkoutError}
          paymentMethodCallback={addPaymentMethod}
          buttonTitle="Add"
        />
      </Dialog>
    </SettingTableContainer>
  );
}

Settings.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
};

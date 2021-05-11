import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Dialog, Typography } from "@material-ui/core";
import ChangePassword from "../../components/Settings/ChangePassword";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CreditCardIcon from "@material-ui/icons/CreditCard";
// local variables
import { userRoles } from "variables/userRoles";
// local components
import ActiveSubscriptions from "../../components/Settings/ActiveSubscriptions";
// amplify components
import { API, graphqlOperation } from "aws-amplify";

const getUserSettings = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      Email
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
  const [trainers, setTrainers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenPassword = () => {
    setOpenDialog(true);
  };

  const handleClosePassword = () => {
    setOpenDialog(false);
  };

  const userRole = props.role;

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
      graphqlOperation(getUserSettings, { id: props.user })
    );
    setEmail(userSettingData.data.getUserProfile.Email);
    return userSettingData.data.getUserProfile.Subscriptions.items;
  }

  useEffect(() => {
    fetchSettings().then((subs) => {
      if (userRole === userRoles.STUDENT) {
        setTrainers(subs);
      }
    });
  }, [props.user]);

  useEffect(() => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/get/payment", myInit)
      .then((d) => {
        setPaymentMethods(d.data.data);
      })
      .catch(console.log);
  }, [props.user]);

  console.log(paymentMethods);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="left" rowSpan={3}>
              <Typography variant="h1">Account</Typography>
            </TableCell>
            <TableCell align="left" colSpan={2}>
              {email}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell rowSpan={4}>
              <Typography variant="h3">Membership and Billing</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Password: ********</TableCell>
            <TableCell align="right">
              <Button onClick={handleOpenPassword}>Change password</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <CreditCardIcon />
                <span>**** **** **** 4242</span>
              </div>
            </TableCell>
            <TableCell align="right">
              <Button>Manage billing info</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} align="right">
              <Button>Billing details</Button>
            </TableCell>
          </TableRow>
        </TableBody>
        {userRole === userRoles.STUDENT ? (
          <ActiveSubscriptions trainers={trainers} user={props.user} />
        ) : null}
      </Table>
      <PasswordDialog />
    </TableContainer>
  );
}

Settings.propTypes = {
  user: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

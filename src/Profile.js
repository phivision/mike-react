import * as React from "react";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { API, graphqlOperation } from "aws-amplify";
import { getUserProfile } from "./graphql/queries";

const initialProfileState = {
  id: "",
  LastName: null,
  FirstName: null,
  UserImage: null,
  RegDate: "",
  UserRole: "",
  Birthday: null,
  Email: null,
  Gender: null,
  Height: null,
  Weight: null,
  Price: null,
  StripID: null,
};

export async function userQuery() {
  const userProfile = await API.graphql(
    graphqlOperation(getUserProfile, { id: props.user.username })
  );
  if (userProfile.data.getUserProfile != null) {
    return userProfile.data.getUserProfile;
  } else {
    alert("cannot find user profile!");
  }
}

export default function Profile(props) {
  const [profile, setProfile] = React.useState(initialProfileState);
  setProfile(props.userProfile);
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Last Name</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Registration Date</TableCell>
            <TableCell align="right">User Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{profile.LastName}</TableCell>
            <TableCell>{profile.FirstName}</TableCell>
            <TableCell>{profile.Email}</TableCell>
            <TableCell>{profile.RegDate}</TableCell>
            <TableCell align="right">{`$${profile.UserRole}`}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

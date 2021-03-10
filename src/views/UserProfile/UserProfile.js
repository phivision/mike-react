import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import TextField from "@material-ui/core/TextField";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import PropTypes from "prop-types";
import { API, graphqlOperation } from "aws-amplify";
import { getUserProfile } from "graphql/queries";

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

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

export default function UserProfile(props) {
  const [profile, setProfile] = React.useState(initialProfileState);

  async function userQuery() {
    const userProfile = await API.graphql(
      graphqlOperation(getUserProfile, { id: props.user })
    );
    if (userProfile.data.getUserProfile != null) {
      return userProfile.data.getUserProfile;
    } else {
      alert("cannot find user profile!");
    }
  }

  function textFieldGenerator(
    breakpoint,
    id,
    label,
    text,
    type = "string",
    readOnly = false
  ) {
    return text == null ? (
      <GridItem xs={breakpoint} sm={breakpoint} md={breakpoint / 2}>
        <TextField
          id={id}
          label={label}
          type={type}
          InputLabelProps={{
            readOnly: readOnly,
          }}
        />
      </GridItem>
    ) : (
      <GridItem xs={breakpoint} sm={breakpoint} md={breakpoint / 2}>
        <TextField
          id={id}
          label={label}
          type={type}
          value={text}
          InputLabelProps={{
            shrink: true,
            readOnly: readOnly,
          }}
        />
      </GridItem>
    );
  }

  useEffect(() => {
    userQuery().then((r) => setProfile(r));
  }, [props.user]);

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                {textFieldGenerator(
                  6,
                  "email",
                  "Email",
                  profile.Email,
                  "string",
                  true
                )}
                {textFieldGenerator(
                  6,
                  "last-name",
                  "Last Name",
                  profile.LastName
                )}
                {textFieldGenerator(
                  6,
                  "first-name",
                  "First Name",
                  profile.FirstName
                )}
              </GridContainer>
              <GridContainer>
                {textFieldGenerator(
                  6,
                  "user-role",
                  "User Role",
                  profile.UserRole,
                  "string",
                  true
                )}
                {textFieldGenerator(
                  6,
                  "reg-date",
                  "Registration Date",
                  profile.RegDate,
                  "string",
                  true
                )}
                {textFieldGenerator(
                  6,
                  "birthday",
                  "Birthday",
                  profile.Birthday
                )}
              </GridContainer>
              <GridContainer>
                {textFieldGenerator(6, "gender", "Gender", profile.Gender)}
                {textFieldGenerator(
                  6,
                  "height",
                  "Height",
                  profile.Height,
                  "number"
                )}
                {textFieldGenerator(
                  6,
                  "weight",
                  "Weight",
                  profile.Weight,
                  "number"
                )}
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary">Update Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

UserProfile.propTypes = {
  user: PropTypes.string,
};

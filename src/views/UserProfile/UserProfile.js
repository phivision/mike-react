import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import PropTypes from "prop-types";
import { API, graphqlOperation } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import { updateUserProfile } from "graphql/mutations";

const initialProfileState = {
  id: "",
  LastName: "",
  FirstName: "",
  UserImage: null,
  RegDate: "",
  UserRole: "",
  Birthday: null,
  Email: "",
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
    try {
      const userProfile = await API.graphql(
        graphqlOperation(getUserProfile, { id: props.user })
      );
      if (userProfile.data.getUserProfile != null) {
        setProfile(userProfile.data.getUserProfile);
      } else {
        console.log("cannot find user profile!");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function userUpdate() {
    const updatedProfile = {
      id: profile.id,
      Birthday: profile.Birthday,
      Gender: profile.Gender,
      Height: profile.Height,
      Weight: profile.Weight,
      LastName: profile.LastName,
      FirstName: profile.FirstName,
    };
    try {
      const resultedProfile = await API.graphql(
        graphqlOperation(updateUserProfile, {
          input: updatedProfile,
        })
      );
      if (resultedProfile.data.updateUserProfile != null) {
        setProfile(resultedProfile.data.updateUserProfile);
      } else {
        console.log("cannot update user profile!");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const genders = [
    {
      value: "male",
      label: "Male",
    },
    {
      value: "female",
      label: "Female",
    },
    {
      value: "",
      label: "Undefined",
    },
  ];

  function textFieldGenerator(
    breakpoint,
    id,
    label,
    val,
    type = "text",
    readOnly = false,
    shrink = false
  ) {
    // only generate unchanged text field
    const inputLabelProps =
      val == null && type !== "date"
        ? { readOnly: readOnly }
        : { shrink: shrink, readOnly: readOnly };
    return (
      <GridItem xs={breakpoint} sm={breakpoint} md={breakpoint / 2}>
        <TextField
          id={id}
          label={label}
          type={type}
          value={val || ""}
          InputLabelProps={inputLabelProps}
        />
      </GridItem>
    );
  }

  useEffect(() => {
    userQuery();
  }, [props.user]);

  const classes = useStyles();
  // TODO: change to drop down menu to select from a list of genders
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
                  "email",
                  true,
                  true
                )}
                <GridItem xs={6} sm={6} md={3}>
                  <TextField
                    id="last-name"
                    label="Last Name"
                    name="LastName"
                    value={profile.LastName || ""}
                    onChange={handleChange}
                  />
                </GridItem>
                <GridItem xs={6} sm={6} md={3}>
                  <TextField
                    id="first-name"
                    label="First Name"
                    name="FirstName"
                    value={profile.FirstName || ""}
                    onChange={handleChange}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                {textFieldGenerator(
                  6,
                  "user-role",
                  "User Role",
                  profile.UserRole,
                  "text",
                  true,
                  true
                )}
                {textFieldGenerator(
                  6,
                  "reg-date",
                  "Registration Date",
                  profile.RegDate,
                  "date",
                  true,
                  true
                )}
                <GridItem xs={6} sm={6} md={3}>
                  <TextField
                    id="birthday"
                    label="Birthday"
                    name="Birthday"
                    type="date"
                    value={profile.Birthday || ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true, readOnly: false }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={6} sm={6} md={3}>
                  <TextField
                    id="gender"
                    select
                    label="Gender"
                    name="Gender"
                    value={profile.Gender || ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  >
                    {genders.map((gender) => (
                      <MenuItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </GridItem>
                <GridItem xs={6} sm={6} md={3}>
                  <TextField
                    id="height"
                    label="Height (cm)"
                    name="Height"
                    type="number"
                    value={profile.Height || 0.0}
                    onChange={handleChange}
                  />
                </GridItem>
                <GridItem xs={6} sm={6} md={3}>
                  <TextField
                    id="weight"
                    label="Weight (pound)"
                    name="Weight"
                    type="number"
                    value={profile.Weight || 0.0}
                    onChange={handleChange}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={userUpdate}>
                Update Profile
              </Button>
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

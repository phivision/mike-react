import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import PropTypes from "prop-types";
import { API, Storage, graphqlOperation } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import { updateUserProfile } from "graphql/mutations";
// resources
import avatar from "assets/img/faces/marc.jpg";
import cover from "assets/img/cover.jpeg";

const initialProfileState = {
  id: "",
  LastName: "",
  FirstName: "",
  Description: null,
  UserImage: null,
  ImageURL: null,
  BgImage: null,
  BgURL: null,
  RegDate: "",
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
  media: {
    height: 200,
  },
};

const useStyles = makeStyles(styles);

export default function UserProfile(props) {
  const [profile, setProfile] = React.useState(initialProfileState);

  async function userQuery() {
    try {
      const userProfileData = await API.graphql(
        graphqlOperation(getUserProfile, { id: props.user })
      );
      const userProfile = userProfileData.data.getUserProfile;
      if (userProfile.UserImage) {
        // get url for the user image and update it to the profile view
        userProfile.ImageURL = await Storage.get(userProfile.UserImage);
      } else {
        // if image is not yet uploaded, use local avatar
        userProfile.ImageURL = avatar;
      }
      if (userProfile.BgImage) {
        userProfile.BgURL = await Storage.get(userProfile.BgImage);
      } else {
        userProfile.BgURL = cover;
      }
      if (userProfile) {
        setProfile(userProfile);
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
      UserImage: profile.UserImage,
      BgImage: profile.BgImage,
      Description: profile.Description,
    };
    try {
      const resultedProfile = await API.graphql(
        graphqlOperation(updateUserProfile, {
          input: updatedProfile,
        })
      );
      const updatedUserProfile = resultedProfile.data.updateUserProfile;
      // if user image uploaded, replace the local path with s3 url and update the local webpage
      if (profile.UserImage) {
        updatedUserProfile.ImageURL = await Storage.get(profile.UserImage);
      } else {
        updatedUserProfile.ImageURL = avatar;
      }
      if (profile.BgImage) {
        updatedUserProfile.BgURL = await Storage.get(profile.BgImage);
      } else {
        updatedUserProfile.BgURL = cover;
      }
      if (updatedUserProfile) {
        setProfile(updatedUserProfile);
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

  async function handleImageChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setProfile({ ...profile, UserImage: file.name });
    try {
      await Storage.put(file.name, file, { contentType: "image/*" });
    } catch (e) {
      const msg = "Error uploading file: " + e.message;
      console.log(e);
      alert(msg);
    }
  }

  async function handleBackgroundChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setProfile({ ...profile, BgImage: file.name });
    try {
      await Storage.put(file.name, file, { contentType: "image/*" });
    } catch (e) {
      const msg = "Error uploading file: " + e.message;
      console.log(e);
      alert(msg);
    }
  }

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
  // TODO: update the user group (student or trainer) in the avatar card if the schema is updated
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <img src={profile.ImageURL} alt="..." />
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardTitle}>
                {"Role: " + profile.UserRole}
              </h4>
              <InputLabel>Choose image for user profile</InputLabel>
              <Input
                type="file"
                name="UserImage"
                accept="image/*"
                onChange={handleImageChange}
              />
              <InputLabel>Choose image for user background</InputLabel>
              <Input
                type="file"
                name="BgImage"
                accept="image/*"
                onChange={handleBackgroundChange}
              />
              <Button color="primary" onClick={userUpdate}>
                Update Images
              </Button>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardMedia
              className={classes.media}
              image={profile.BgURL}
              title="User Background"
            />
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
              <GridContainer>
                <GridItem>
                  <TextField
                    id="description"
                    label="Description"
                    name="Description"
                    multiline
                    rows={4}
                    value={profile.Description || ""}
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

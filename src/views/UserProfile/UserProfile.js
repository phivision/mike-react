import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import {
  CardMedia,
  Avatar,
  Input,
  InputLabel,
  TextField,
  MenuItem,
  Grid,
  CardContent,
  Typography,
} from "@material-ui/core";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import PropTypes from "prop-types";
import { API, Storage, graphqlOperation } from "aws-amplify";
import { getUserProfile } from "graphql/queries";
import { updateUserProfile } from "graphql/mutations";
// resources
import avatar from "assets/img/faces/marc.jpg";
import cover from "assets/img/cover.jpeg";
//load landing page style
import landingPageStyle from "assets/jss/material-dashboard-react/views/landingpageStyle";

const useStyles = makeStyles(landingPageStyle);

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
  Biography: "Please input your biography.",
  BgTitle: "Please input the Title of background image.",
};

export default function UserProfile(props) {
  const [profile, setProfile] = React.useState(initialProfileState);

  async function updateUserImages(userProfile) {
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
  }

  async function userQuery() {
    const userProfileData = await API.graphql(
      graphqlOperation(getUserProfile, { id: props.user })
    );
    const userProfile = userProfileData.data.getUserProfile;
    updateUserImages(userProfile)
      .then(() => {
        if (userProfile) {
          setProfile(userProfile);
        }
      })
      .catch((e) => {
        console.log("cannot find user profile!");
        console.log(e);
      });
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
      Biography: profile.Biography,
      BgTitle: profile.BgTitle,
    };
    const resultedProfile = await API.graphql(
      graphqlOperation(updateUserProfile, {
        input: updatedProfile,
      })
    );
    const updatedUserProfile = resultedProfile.data.updateUserProfile;
    // if user image uploaded, replace the local path with s3 url and update the local webpage
    updateUserImages(updatedUserProfile)
      .then(() => {
        if (updatedUserProfile) {
          setProfile(updatedUserProfile);
        }
      })
      .catch((e) => {
        console.log("cannot update user profile!");
        console.log(e);
      });
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

  useEffect(() => {
    userQuery();
  }, [props.user]);

  const classes = useStyles();
  return (
    <GridContainer>
      <Card>
        <CardMedia
          className={classes.BImage}
          image={profile.BgURL}
          title="User Background"
        >
          <Input
            name="BgImage"
            accept="image/*"
            className={classes.input}
            id="BgImage-upload-button"
            type="file"
            onChange={handleBackgroundChange}
          />
          <InputLabel htmlFor="BgImage-upload-button">
            <Button variant="contained" color="rose" component="span">
              Replace Image
            </Button>
          </InputLabel>
          <TextField
            id="BgTitle"
            label="Background Title"
            name="BgTitle"
            variant="filled"
            multiline
            style={{ margin: "8%", width: "60%" }}
            value={profile.BgTitle}
            margin="normal"
            onChange={handleChange}
          />
        </CardMedia>
        <Grid container className={classes.profileContainer}>
          <Grid item xs={4}>
            <Avatar
              aria-label="photo"
              className={classes.avatar}
              src={profile.ImageURL}
            />
            <Input
              name="UserImage"
              accept="image/*"
              className={classes.input}
              id="photo-upload"
              type="file"
              onChange={handleImageChange}
            />
            <InputLabel htmlFor="photo-upload" className={classes.centerAlign}>
              <Button variant="contained" color="rose" component="span">
                Replace Photo
              </Button>
            </InputLabel>
          </Grid>
          <Grid item xs={8}>
            <GridContainer>
              <GridItem xs={4}>
                <TextField
                  id="last-name"
                  label="Last Name"
                  name="LastName"
                  value={profile.LastName || ""}
                  onChange={handleChange}
                />
              </GridItem>
              <GridItem xs={4}>
                <TextField
                  id="first-name"
                  label="First Name"
                  name="FirstName"
                  value={profile.FirstName || ""}
                  onChange={handleChange}
                />
              </GridItem>
              <GridItem xs={4}>
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
              <GridItem xs={4}>
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
              <GridItem xs={4}>
                <TextField
                  id="height"
                  label="Height (cm)"
                  name="Height"
                  type="number"
                  value={profile.Height || 0.0}
                  onChange={handleChange}
                />
              </GridItem>
              <GridItem xs={4}>
                <TextField
                  id="weight"
                  label="Weight (pound)"
                  name="Weight"
                  type="number"
                  value={profile.Weight || 0.0}
                  onChange={handleChange}
                />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  id="description"
                  name="Description"
                  label="Description"
                  multiline
                  fullWidth
                  rows={4}
                  value={profile.Description || ""}
                  onChange={handleChange}
                  className={classes.BioDescription}
                />
              </GridItem>
            </GridContainer>
          </Grid>
        </Grid>
        <CardContent className={classes.profileContainer}>
          <CardContent className={classes.CardBox}>
            <Typography variant="h4" component="h1">
              Biograpghy
            </Typography>
            <TextField
              id="BiograpghyText"
              name="BiograpghyText"
              label="Biograpghy"
              multiline
              fullWidth
              rows={4}
              value={profile.Biography || ""}
              onChange={handleChange}
            />
          </CardContent>
        </CardContent>
        <CardContent className={classes.centerAlign}>
          <Button color="rose" onClick={userUpdate}>
            Submit All Changes
          </Button>
        </CardContent>
      </Card>
    </GridContainer>
  );
}

UserProfile.propTypes = {
  user: PropTypes.string,
};

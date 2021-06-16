import React, { useEffect, useState } from "react";
import {
  CustomButton,
  GridContainer,
  GridItem,
  ProfileBox,
} from "../StyledComponents/StyledComponents";
import IconButton from "@material-ui/core/IconButton";
import UserAvatar from "../UserAvatar/UserAvatar";
import EditableTypography from "../EditableTypography/EditableTypography";
import { userRoles } from "../../variables/userRoles";
import { Typography } from "@material-ui/core";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { updateUserProfile } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";
import { beforeImageUpload } from "../../utilities/ImagesCompress";
import PropTypes from "prop-types";
import { userProfileQuery } from "../../graphql/UserFeed";

let tempProfile;

// import initial profile
const initialProfileState = {
  id: "",
  Birthday: null,
  Height: null,
  UserImage: null,
  LastName: "",
  FirstName: "",
  Weight: null,
  Description: null,
};

export default function UserProfile(props) {
  const [profile, setProfile] = useState(initialProfileState);
  const [edit, setEdit] = useState(false);
  const history = useHistory();

  const userQuery = async () => {
    const d = await API.graphql(
      graphqlOperation(userProfileQuery, { id: props.user.id })
    ).catch(console.log);
    setProfile(d.data.getUserProfile);
  };

  const onChange = (e) => {
    switch (e.target.id) {
      case "firstName":
        setProfile({ ...profile, FirstName: e.target.value });
        break;
      case "lastName":
        setProfile({ ...profile, LastName: e.target.value });
        break;
      case "description":
        setProfile({ ...profile, Description: e.target.value });
        break;
    }
  };

  const onClickEditProfile = async (type) => {
    if (edit) {
      if (type === "submit-changes") {
        API.graphql({
          query: updateUserProfile,
          variables: { input: profile },
        });
      } else {
        setProfile(tempProfile);
      }
    } else {
      tempProfile = { ...profile };
    }
    setEdit(!edit);
  };

  const handleImageChange = async (e) => {
    if (!e.target.files[0]) return;
    const avatar = e.target.files[0];
    let newAvatr;
    const nameArray = e.target.files[0].name.split(".");
    const userImageName =
      ("UserImage" + props.user.id + Date.now()).replace(/[^0-9a-z]/gi, "") +
      "." +
      nameArray[nameArray.length - 1];
    //if > 100kb, then compress avatar image to small size
    console.log("original Avatar size", avatar.size / 1024);
    if (avatar.size > 1024 * 1024 * 0.1) {
      newAvatr = await beforeImageUpload(avatar, 150);
      console.log("compressed Avatar size", newAvatr.size / 1024);
    } else {
      newAvatr = avatar;
    }
    console.log("newAvatr", newAvatr);
    await Storage.put(userImageName, newAvatr, {
      contentType: "image/*",
    });
    setProfile({ ...profile, UserImage: userImageName });
  };

  useEffect(() => {
    if (props.user.id) {
      userQuery();
    }
  }, [props.user.id]);

  return (
    <GridContainer item direction="column" xs={12} sm={4}>
      <ProfileBox>
        <GridContainer>
          {edit ? (
            <div>
              <input
                accept="image/*"
                id="profile-upload"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="profile-upload">
                <IconButton component="span">
                  <UserAvatar UserImage={profile.UserImage} />
                </IconButton>
              </label>
            </div>
          ) : (
            <UserAvatar UserImage={profile.UserImage} />
          )}
        </GridContainer>
        <GridContainer item direction="row">
          <EditableTypography
            variant="h3"
            label="First Name"
            text={profile.FirstName}
            edit={edit}
            onChange={onChange}
            id="firstName"
          />
          <EditableTypography
            variant="h3"
            label="Last Name"
            text={profile.LastName}
            edit={edit}
            onChange={onChange}
            id="lastName"
          />
        </GridContainer>
        <GridItem variant="body1" xs={12}>
          <EditableTypography
            variant="body1"
            edit={edit}
            label="Description"
            onChange={onChange}
            id="description"
            multiline="true"
            text={profile.Description}
          />
        </GridItem>
        <GridItem xs={12}>
          {edit ? (
            <GridItem>
              <CustomButton
                variant="contained"
                fullWidth
                onClick={() => onClickEditProfile("submit-changes")}
              >
                Submit Changes
              </CustomButton>
              <CustomButton fullWidth onClick={onClickEditProfile}>
                Discard Changes
              </CustomButton>
            </GridItem>
          ) : (
            <CustomButton
              color="primary"
              variant="contained"
              onClick={onClickEditProfile}
              size="large"
            >
              Edit
            </CustomButton>
          )}
        </GridItem>
      </ProfileBox>
      {props.user.role === userRoles.STUDENT ? (
        <>
          <GridItem>
            <Typography variant="h3">My Trainers</Typography>
          </GridItem>
          <GridItem container direction="row">
            {props.trainers.map((trainer, idx) => {
              return (
                <GridItem key={idx}>
                  <UserAvatar
                    UserImage={trainer.UserImage}
                    onClick={() => history.push(`/landingpage/${trainer.id}`)}
                  />
                </GridItem>
              );
            })}
          </GridItem>
        </>
      ) : (
        <></>
      )}
    </GridContainer>
  );
}

UserProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
  trainers: PropTypes.array,
};

import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import EditableTypography from "../EditableTypography/EditableTypography";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";
import PropTypes from "prop-types";
import { TextStyle } from "../StyledComponents/StyledComponents";
import { InputAdornment } from "@material-ui/core";
import { API, graphqlOperation } from "aws-amplify";
import { updateUserProfile } from "../../graphql/mutations";
import CustomSnackbar from "../CustomSnackbar/CustomSnackbar";

const EditURL = ({ ...props }) => {
  const [edit, setEdit] = useState(false);
  const [url, setURL] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const changeURL = (u) => {
    if (u.length > 35) {
      setURL(props.url);
      setSnackbarMessage("URL is too long. Use less than 36 characters.");
    } else {
      const urlQuery = `query MyQuery($LandingURL: String!) {
        profilesByURL(LandingURL: $LandingURL) {
          items {
            id
          }
        }
      }`;

      API.graphql(graphqlOperation(urlQuery, { LandingURL: u }))
        .then((d) => {
          if (d.data.profilesByURL.items.length > 0) {
            if (d.data.profilesByURL.items[0].id === props.user.id) {
              setURL(props.url);
              setSnackbarMessage("URL not changed.");
            } else {
              setURL(props.url);
              setSnackbarMessage("URL is already taken.");
            }
          } else {
            API.graphql({
              query: updateUserProfile,
              variables: { input: { id: props.user.id, LandingURL: u } },
            })
              .then(() => {
                setSnackbarMessage("URL Updated Successfully");
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch(console.log);
    }
  };

  useEffect(() => {
    setURL(props.url);
  }, [props.url]);

  const onClick = () => {
    if (!edit) {
      setEdit(true);
    } else {
      changeURL(url);
      setEdit(false);
    }
  };

  return (
    <>
      <Grid item xs>
        <TextStyle variant="h3">Custom URL</TextStyle>
      </Grid>
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        justify="space-between"
        style={{ padding: "10px" }}
        xs
      >
        <Grid item>
          <EditableTypography
            text={url}
            edit={edit}
            variant="body1"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  joinmotion.app/
                </InputAdornment>
              ),
            }}
            label="Custom Landing Page URL"
            onChange={(e) => {
              setURL(e.target.value);
            }}
          />
        </Grid>
        <Grid item>
          <IconButton onClick={onClick}>
            {edit ? <DoneIcon /> : <EditIcon />}
          </IconButton>
        </Grid>
      </Grid>
      <CustomSnackbar
        message={snackbarMessage}
        setMessage={setSnackbarMessage}
      />
    </>
  );
};

EditURL.propTypes = {
  url: PropTypes.string,
  user: {
    id: PropTypes.string,
  },
};

export default EditURL;

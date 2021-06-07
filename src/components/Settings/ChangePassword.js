import React, { useState } from "react";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function ChangePassword() {
  const classes = useStyles();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, currentPassword, newPassword);
      })
      .then((data) => {
        console.log(data);
        alert("Change password: " + data);
      })
      .catch((err) => {
        console.log(err);
        alert("Change password: " + err.message);
      });
  }

  return (
    <form
      className={classes.root}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        id="filled-current-password-input"
        label="currentPassword"
        type="password"
        autoComplete="current-password"
        variant="filled"
        onChange={(e) => {
          setCurrentPassword(e.target.value);
        }}
      />
      <TextField
        id="filled-new-password-input"
        label="newPassword"
        type="password"
        autoComplete="new-password"
        variant="filled"
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      />
      <Button type="submit" color="primary">
        Change Password
      </Button>
    </form>
  );
}

import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
// import auth styles
import authStyles from "../../assets/jss/material-dashboard-react/views/authStyle";

export default function SignUpForm({ openError: openError, ...props }) {
  const classes = authStyles();
  const history = useHistory();

  const [state, setState] = React.useState({
    email: "",
    password: "",
    remember: false,
    firstName: null,
    lastName: null,
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await Auth.signUp({
        username: state.email,
        password: state.password,
        attributes: {
          "custom:role": props.match.params.role,
          "custom:first_name": state.firstName,
          "custom:last_name": state.lastName,
        },
      });

      if (props.location.state !== undefined) {
        if (props.location.state.next !== undefined) {
          history.push({
            pathname: "/verify/",
            state: {
              username: state.email,
              password: state.password,
              role: props.match.params.role,
              next: props.location.state.next,
            },
          });
        }
      } else {
        history.push({
          pathname: "/verify/",
          state: {
            username: state.email,
            password: state.password,
            role: props.match.params.role,
          },
        });
      }
    } catch (error) {
      openError(error.message);
    }
  }
  return (
    <form className={classes.form} onSubmit={(e) => handleSubmit(e)} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="fname"
            name="firstName"
            variant="outlined"
            required
            fullWidth
            id="firstName"
            label="First Name"
            onChange={(e) => handleChange(e)}
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            onChange={(e) => handleChange(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => handleChange(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => handleChange(e)}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Sign Up
      </Button>
      <Grid container justify="flex-end">
        <Grid item>
          <Link to="/signin">Already have an account? Sign in</Link>
        </Grid>
      </Grid>
    </form>
  );
}

SignUpForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      role: PropTypes.string,
    }),
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      next: PropTypes.object,
    }),
  }),
  openError: PropTypes.func,
};

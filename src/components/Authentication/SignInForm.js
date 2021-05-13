import React from "react";
import {
  TextField,
  FormControlLabel,
  Button,
  Grid,
  Checkbox,
} from "@material-ui/core";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
// import auth styles
import authStyles from "../../assets/jss/material-dashboard-react/views/authStyle";

export default function SignInForm({ openError: openError, ...props }) {
  const classes = authStyles();
  const history = useHistory();

  const [state, setState] = React.useState(
    localStorage.getItem("remember")
      ? {
          email: localStorage.getItem("username"),
          password: localStorage.getItem("password"),
          remember: true,
        }
      : {
          email: "",
          password: "",
          remember: false,
        }
  );

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
      await Auth.signIn({
        username: state.email,
        password: state.password,
      }).then(() => {
        if (state.remember) {
          localStorage.setItem("username", state.email);
          localStorage.setItem("password", state.password);
        }
        localStorage.setItem("remember", state.remember);
        if (props.location.state !== undefined) {
          if (props.location.state.next !== undefined) {
            history.push(props.location.state.next);
          }
        } else {
          history.push("/user/");
        }
      });
    } catch (error) {
      openError(error.message);
    }
  }

  return (
    <form className={classes.form} onSubmit={(e) => handleSubmit(e)} noValidate>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={state.email}
        onChange={(e) => handleChange(e)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={state.password}
        onChange={(e) => handleChange(e)}
      />
      <FormControlLabel
        control={
          <Checkbox
            value="remember"
            name="remember"
            color="primary"
            defaultChecked={state.remember}
            onChange={(e) => handleChange(e)}
          />
        }
        label="Remember me"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Sign In
      </Button>
      <Grid container>
        <Grid item xs>
          <Link to="/">Forgot password?</Link>
        </Grid>
        <Grid item>
          {props.location.state !== undefined ? (
            <Link
              to={{
                pathname: "/signup/student",
                state: { next: props.location.state.next },
              }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          ) : (
            <Link
              to={{
                pathname: "/signup/student",
              }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

SignInForm.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      next: PropTypes.object,
    }),
  }),
  openError: PropTypes.func,
};

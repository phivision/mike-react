import React from "react";
import { TextField, FormControlLabel, Grid, Checkbox } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { CustomButton } from "../StyledComponents/StyledComponents";
// import auth styles

export default function SignInForm({ openError: openError, ...props }) {
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
        }
        history.push("/user/");
      });
    } catch (error) {
      openError(error.message);
    }
  }

  const signUpLink = () => {
    return props.location.state !== undefined ? (
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
    );
  };

  const resetPasswordLink = () => {
    return (
      <Link
        to={{
          pathname: "/reset",
        }}
      >
        Forgot password?
      </Link>
    );
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} noValidate>
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
      <CustomButton type="submit" fullWidth variant="contained">
        Sign In
      </CustomButton>
      <Grid container>
        <Grid item xs>
          {resetPasswordLink()}
        </Grid>
        <Grid item>{signUpLink()}</Grid>
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

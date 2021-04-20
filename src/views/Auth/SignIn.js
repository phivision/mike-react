import React from "react";
import {
  Container,
  CssBaseline,
  Typography,
  TextField,
  FormControlLabel,
  Button,
  Grid,
  Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

//TODO: Modularize the sign-in/sign-up system into components
//TODO: Setup forgot password page
//TODO: Error handling for authentication
export default function SignIn({ ...props }) {
  const classes = useStyles();
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
        if (props.props.location.state !== undefined) {
          if (props.props.location.state.next !== undefined) {
            history.push(props.props.location.state.next);
          }
        } else {
          history.push("/admin/dashboard/");
        }
      });
    } catch (error) {
      console.log("error signing up:", error);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => handleSubmit(e)}
          noValidate
        >
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
              <Link to="/home/">Forgot password?</Link>
            </Grid>
            <Grid item>
              {props.props.location.state !== undefined ? (
                <Link
                  to={{
                    pathname: "/home/signup/student",
                    state: { next: props.props.location.state.next },
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: "/home/signup/student",
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              )}
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

SignIn.propTypes = {
  props: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        next: PropTypes.object,
      }),
    }),
  }),
};

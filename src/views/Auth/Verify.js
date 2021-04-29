import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Auth } from "aws-amplify";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
// import auth styles
import authStyles from "../../assets/jss/material-dashboard-react/views/authStyle";

export default function Verify({ ...props }) {
  const classes = authStyles();
  const history = useHistory();

  const [state, setState] = React.useState({
    verify0: null,
    verify1: null,
    verify2: null,
    verify3: null,
    verify4: null,
    verify5: null,
  });

  const refs = React.useRef([]);

  const handleChange = (e) => {
    if (e.target.value.length <= 1) {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    }
    if (e.target.value.length === 1 && parseInt(e.target.id) < 5) {
      refs.current[parseInt(e.target.id) + 1].focus();
    }
  };

  const stripeOnboarding = async (cognitoID) => {
    if (props.props.location.state.role === "trainer") {
      const myInit = {
        headers: {}, // AWS-IAM authorization if using empty headers
        body: {
          email: props.props.location.state.username,
          id: cognitoID,
        },
        response: true,
      };
      await API.post("stripeAPI", "/stripe/api/trainer/create", myInit);
    } else {
      const myInit = {
        headers: {}, // AWS-IAM authorization if using empty headers
        body: {
          email: props.props.location.state.username,
          id: cognitoID,
        },
        response: true,
      };

      await API.post("stripeAPI", "/stripe/api/user/create", myInit);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    let code =
      state.verify0 +
      state.verify1 +
      state.verify2 +
      state.verify3 +
      state.verify4 +
      state.verify5;
    try {
      await Auth.confirmSignUp(props.props.location.state.username, code).then(
        async () => {
          await Auth.signIn(
            props.props.location.state.username,
            props.props.location.state.password
          ).then(async (user) => {
            await stripeOnboarding(user.username).then(() => {
              if (props.props.location.state !== undefined) {
                if (props.props.location.state.next !== undefined) {
                  history.push(props.props.location.state.next);
                }
              }
              history.push("/admin/dashboard/");
            });
          });
        }
      );
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  const fields = () => {
    let arr = [];
    for (let i = 0; i < 6; i++) {
      arr.push(
        <Grid item xs={12} sm={2} key={i}>
          <TextField
            name={"verify" + i}
            key={"verify" + i}
            variant="outlined"
            required
            fullWidth
            id={"" + i}
            onChange={(e) => handleChange(e)}
            inputRef={(e) => (refs.current[i] = e)}
          />
        </Grid>
      );
    }
    return arr;
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Verify your email
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => handleSubmit(e)}
          noValidate
        >
          <Grid container spacing={2}>
            {fields()}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Verify
          </Button>
        </form>
      </div>
    </Container>
  );
}

Verify.propTypes = {
  props: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        next: PropTypes.object,
      }),
    }),
  }),
};

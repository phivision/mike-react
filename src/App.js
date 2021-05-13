import React from "react";
import "./App.css";
import Amplify, { API } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Hub } from "aws-amplify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { BrowserRouter, Switch, Redirect } from "react-router-dom";

import "assets/css/material-dashboard-react.css?v=1.9.0";

import theme from "./theme.js";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Header from "./components/Header/Header";
import { headerRoutes, routes } from "./routes";
import Footer from "./components/Footer/Footer";
import { Container, Dialog, DialogContent } from "@material-ui/core";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import CssBaseline from "@material-ui/core/CssBaseline";

// amplify config
Amplify.configure(awsconfig);

const stripePromise = loadStripe(
  "pk_test_51IWoNlAXegvVyt5sEGxoPrV9MfyryI7OR5vKuY4bLXUgqWIE2Dv0TmtY5R9BVHpjhg3qssoAF3z5GhtkgHrc8Mc400VDRuU2yX"
);

const initialUser = { id: null, role: "unknown" };
let isVerified;

//TODO: Remove excess components
const App = () => {
  const [user, setUser] = React.useState(initialUser);
  const [openContentUpload, setOpenContentUpload] = React.useState(false);

  const switchRoutes = (routes) => {
    return (
      <Switch>
        {routes.map((route) => {
          return route.auth ? (
            <PrivateRoute
              path={route.path}
              component={route.component}
              user={user}
              key={route.name}
              exact={route.exact}
            />
          ) : (
            <PublicRoute
              path={route.path}
              component={route.component}
              user={user}
              key={route.name}
              exact={route.exact}
            />
          );
        })}
      </Switch>
    );
  };

  const checkVerification = () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: user.id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/get/account", myInit)
      .then((d) => {
        return d.data.details_submitted;
      })
      .catch(console.log);
    return false;
  };

  const handleOpenContentUpload = () => {
    isVerified = checkVerification();
    setOpenContentUpload(true);
  };

  const handleCloseContentUpload = () => {
    setOpenContentUpload(false);
  };

  React.useEffect(() => {
    Hub.listen("auth", (data) => {
      if (data.payload.event === "signIn") {
        setUser({
          id: data.payload.data.attributes.sub,
          role: data.payload.data.attributes["custom:role"],
        });
        Amplify.configure({
          aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
        });
      }
      if (data.payload.event === "signOut") {
        setUser(initialUser);
        Amplify.configure({
          aws_appsync_authenticationType: "AWS_IAM",
        });
      }
    });
  }, []);

  const ContentUploadDialog = () => {
    const body = (
      <DialogContent>
        <headerRoutes.videoUpload.component
          user={user.id}
          onClose={handleCloseContentUpload}
          isVerified={isVerified}
        />
      </DialogContent>
    );
    return (
      <Dialog open={openContentUpload} fullWidth maxWidth="md">
        {body}
      </Dialog>
    );
  };

  return (
    <Elements stripe={stripePromise}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Container maxWidth={false} disableGutters={true}>
            <Header user={user} onContentUpload={handleOpenContentUpload} />
            <div>
              <Switch>
                {switchRoutes(routes)}
                <Redirect to="/" />
              </Switch>
              <ContentUploadDialog />
            </div>
            <Footer />
          </Container>
        </BrowserRouter>
      </MuiThemeProvider>
    </Elements>
  );
};

export default App;

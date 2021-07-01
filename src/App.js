import React, { useEffect } from "react";
import "./App.css";
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
import { Hub } from "aws-amplify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import theme from "./theme.js";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Header from "./components/Header/Header";
import { routes } from "./routes";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import CssBaseline from "@material-ui/core/CssBaseline";
import UploadDialog from "./views/ContentUpload/UploadDialog";
import { FlexContain } from "./components/StyledComponents/StyledComponents";
import { getStripeKey } from "./utilities/StripeTools";

const stripePublishableKey = getStripeKey();

const stripePromise = loadStripe(stripePublishableKey);

const initialUser = { id: null, role: "unknown" };

//TODO: Remove excess components
const App = () => {
  const [user, setUser] = React.useState(initialUser);
  const [verified, setVerified] = React.useState(false);
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
    const getVerification = /* GraphQL */ `
      query GetUserProfile($id: ID!) {
        getUserProfile(id: $id) {
          IsVerified
        }
      }
    `;

    API.graphql(graphqlOperation(getVerification, { id: user.id }))
      .then((d) => {
        setVerified(d.data.getUserProfile.IsVerified);
        setOpenContentUpload(true);
      })
      .catch(console.log);
  };

  const handleOpenContentUpload = () => {
    checkVerification();
  };

  const handleCloseContentUpload = () => {
    setOpenContentUpload(false);
  };

  useEffect(() => {
    Auth.currentSession().then((res) => {
      if (res.isValid()) {
        setUser({
          id: res.idToken.payload["cognito:username"],
          role: res.idToken.payload["custom:role"],
        });
        Amplify.configure({
          aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
        });
      }
    });
  }, []);

  useEffect(() => {
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

  return (
    <Elements stripe={stripePromise}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <FlexContain>
            <Header user={user} onContentUpload={handleOpenContentUpload} />
            <div>
              <Switch>
                {switchRoutes(routes)}
                <Redirect to="/" />
              </Switch>
              <UploadDialog
                open={openContentUpload}
                onClose={handleCloseContentUpload}
                user={user.id}
                isVerified={verified}
              />
            </div>
            <Footer />
          </FlexContain>
        </BrowserRouter>
      </MuiThemeProvider>
    </Elements>
  );
};

export default App;

import React from "react";
import "./App.css";
import Amplify, { API, Auth } from "aws-amplify";
import { Hub } from "aws-amplify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import "assets/css/material-dashboard-react.css?v=1.9.0";
import theme from "./theme.js";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Header from "./components/Header/Header";
import { routes } from "./routes";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import CssBaseline from "@material-ui/core/CssBaseline";
import UploadDialog from "./views/ContentUpload/UploadDialog";
import { FlexContain } from "components/StyledComponets/StyledComponets";

const stripePromise = loadStripe(
  "pk_test_51IWoNlAXegvVyt5sEGxoPrV9MfyryI7OR5vKuY4bLXUgqWIE2Dv0TmtY5R9BVHpjhg3qssoAF3z5GhtkgHrc8Mc400VDRuU2yX"
);

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
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: user.id,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/get/account", myInit)
      .then((d) => {
        setVerified(d.data.details_submitted);
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

  React.useEffect(() => {
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

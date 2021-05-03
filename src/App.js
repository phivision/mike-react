import React from "react";
import "./App.css";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";
import { Hub } from "aws-amplify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { BrowserRouter, Switch, Redirect } from "react-router-dom";
// core components
import Admin from "layouts/Admin.js";
import Home from "layouts/Home.js";

import "assets/css/material-dashboard-react.css?v=1.9.0";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";

// amplify config
Amplify.configure(awsconfig);

const stripePromise = loadStripe(
  "pk_test_51IWoNlAXegvVyt5sEGxoPrV9MfyryI7OR5vKuY4bLXUgqWIE2Dv0TmtY5R9BVHpjhg3qssoAF3z5GhtkgHrc8Mc400VDRuU2yX"
);

//TODO: Remove excess components
const App = () => {
  const [authState, setAuthState] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    Hub.listen("auth", (data) => {
      if (data.payload.event === "signIn") {
        setUser(data.payload.data);
        setAuthState(true);
      }
      if (data.payload.event === "signOut") {
        setUser(null);
        setAuthState(false);
      }
    });
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/home" component={Home} />
          <PrivateRoute
            path="/admin"
            user={user}
            auth={authState}
            component={Admin}
          />
          <Redirect to="/home" />
        </Switch>
      </BrowserRouter>
    </Elements>
  );
};

export default App;

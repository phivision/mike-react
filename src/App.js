import React from "react";
import "./App.css";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";
import { Hub } from "aws-amplify";

import { BrowserRouter as Router, Redirect } from "react-router-dom";
// core components
import Admin from "layouts/Admin.js";
import Home from "layouts/Home.js";

import "assets/css/material-dashboard-react.css?v=1.9.0";

// amplify config
Amplify.configure(awsconfig);

const App = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    Hub.listen("auth", (data) => {
      if (data.payload.event === "signIn") {
        setUser(data.payload.data);
        setAuthState(true);
      }
      if (data.payload.event === "signOut") {
        setAuthState(false);
        setUser(null);
      }
    });
  }, []);

  //To-Do: Need to fix functionality with going back in browser.
  return authState ? (
    <Router>
      <Admin user={user} />
      <Redirect from="/" to="/admin/dashboard" />
    </Router>
  ) : (
    <Router>
      <Home />
      <Redirect from="/" to="/home/" />
    </Router>
  );
};

export default App;

import React from "react";
import "./App.css";
import Amplify from "aws-amplify";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignIn,
} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import awsconfig from "./aws-exports";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
// core components
import Admin from "layouts/Admin.js";

import "assets/css/material-dashboard-react.css?v=1.9.0";

// amplify config
Amplify.configure(awsconfig);

const App = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <Router>
      <Admin user={user} />
      <Redirect from="/" to="/admin/dashboard" />
    </Router>
  ) : (
    <AmplifyAuthenticator usernameAlias="email">
      <AmplifySignUp
        slot="sign-up"
        usernameAlias="email"
        formFields={[
          {
            type: "email",
            label: "Email",
            placeholder: "your email address",
            required: true,
          },
          {
            type: "password",
            label: "Password",
            placeholder: "your password",
            required: true,
          },
          {
            type: "phone_number",
            label: "Phone number",
            placeholder: "your phone number",
            required: true,
          },
          // TODO: change the fill-in slot to drop down menu so that the user could only select from options
          {
            type: "custom:role",
            label: "Role",
            placeholder: "your platform role",
            required: true,
          },
        ]}
      />
      <AmplifySignIn slot="sign-in" usernameAlias="email" />
    </AmplifyAuthenticator>
  );
};

export default App;

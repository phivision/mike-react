import React from "react";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignIn,
} from "@aws-amplify/ui-react";

export default function Login() {
  return (
    <div>
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
    </div>
  );
}

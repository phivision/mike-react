import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const App = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

    return authState === AuthState.SignedIn && user ? (
        <div className="App">
            <div>Hello, {user.username}</div>
            <AmplifySignOut />
        </div>
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
                ]}
            />
            <AmplifySignIn slot="sign-in" usernameAlias="email" />
        </AmplifyAuthenticator>
    );
}

export default App;

import React from 'react';
import './App.css';
import Amplify, {Auth, API, graphqlOperation} from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';
import { getUserProfile } from './graphql/queries';

Amplify.configure(awsconfig);
// Use ID token instead of access token in API calls
Amplify.configure({
    API: {
        graphql_headers: async () => {
            const session = await Auth.currentSession();
            return {
                Authorization: session.getIdToken().getJwtToken(),
            };
        },
    },
});
const initialProfileState = {
    id: '',
    LastName: null,
    FirstName: null,
    UserImage: null,
    RegDate: '',
    UserRole: '',
    Birthday: null,
    Email: null,
    Gender: null,
    Height: null,
    Weight: null,
    Price: null,
    StripID: null
}

const App = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();
    const [profile, setProfile] = React.useState(initialProfileState);

    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

    // check if user exist in DynamoDB, if not, create with cognito key
    async function userQuery(){
        const userProfile = await API.graphql(graphqlOperation(getUserProfile, {id: user.username}));
        if(userProfile.data.getUserProfile != null) {
            setProfile(userProfile.data.getUserProfile)
        }else{
            alert('cannot find user profile!')
        }
    }

    return authState === AuthState.SignedIn && user ? (
        <div className="App">
            <div>Hello, {user.username}</div>
            <button onClick={userQuery}>Get Profile</button>
            <div style={{marginBottom: 30}}>
                <div key={profile.Email}>
                    <p>{profile.RegDate}</p>
                    <p>{profile.UserRole}</p>
                </div>
            </div>
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
}

export default App;

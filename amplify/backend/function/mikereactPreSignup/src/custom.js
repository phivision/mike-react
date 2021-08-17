const CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");

const cognitoIdp = new CognitoIdentityServiceProvider();
const userPoolID = process.env.AUTH_MIKEREACT_USERPOOLID;
const getUserByEmail = async (userPoolId, email) => {
  const params = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  };
  return cognitoIdp.listUsers(params).promise();
};

const linkProviderToUser = (
  username,
  userPoolId,
  providerName,
  providerUserId
) => {
  const params = {
    DestinationUser: {
      ProviderAttributeValue: username,
      ProviderName: "Cognito",
    },
    SourceUser: {
      ProviderAttributeName: "Cognito_Subject",
      ProviderAttributeValue: providerUserId,
      ProviderName: "SignInWithApple",
    },
    UserPoolId: userPoolId,
  };

  return cognitoIdp.adminLinkProviderForUser(params).promise();
};

exports.handler = async (event) => {
  if (event.triggerSource === "PreSignUp_ExternalProvider") {
    const userRs = await getUserByEmail(
      userPoolID,
      event.request.userAttributes.email
    );
    if (userRs && userRs.Users.length > 0) {
      const [providerName, providerUserId] = event.userName.split("_");
      console.log("User found.");
      return await linkProviderToUser(
        userRs.Users[0].Username,
        event.userPoolId,
        providerName,
        providerUserId
      );
    } else {
      console.log("User not found.");
    }
  }
};

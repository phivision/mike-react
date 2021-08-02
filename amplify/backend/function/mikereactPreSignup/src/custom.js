const CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");

const cognitoIdp = new CognitoIdentityServiceProvider();
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

exports.handler = async (event, context, callback) => {
  if (event.triggerSource === "PreSignUp_ExternalProvider") {
    const userRs = await getUserByEmail(
      event.userPoolId,
      event.request.userAttributes.email
    );
    console.log(event);
    if (userRs && userRs.Users.length > 0) {
      const [providerName, providerUserId] = event.userName.split("_");
      return linkProviderToUser(
        userRs.Users[0].Username,
        event.userPoolId,
        providerName,
        providerUserId
      );
    } else {
      console.log("user not found, skip.");
      callback(null, event);
    }
  }
};

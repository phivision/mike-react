const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;

const graphql = require("graphql");
const gql = require("graphql-tag");
const { print } = graphql;

const request = (queryDetails, variables) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);
  const endpoint = new urlParse(appsyncUrl).hostname.toString();

  req.method = "POST";
  req.path = "/graphql";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: print(queryDetails),
    variables: variables,
  });

  const signer = new AWS.Signers.V4(req, "appsync", true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      result.on("data", (data) => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
};

const getProfileByID = async (id) => {
  const getUserProfile = gql`
    query getUserProfile($id: ID!) {
      getUserProfile(id: $id) {
        Email
        FirstName
        IsVerified
        LandingURL
        LastName
        StripeID
        TokenBalance
        TokenPrice
        UserRole
      }
    }
  `;
  const variables = { id: id };
  const res = await request(getUserProfile, variables);

  return res.data.getUserProfile;
};

const updateUserProfile = gql`
  mutation updateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      StripeID
      TokenBalance
    }
  }
`;

const setStripeID = async (id, stripeID) => {
  const variables = { input: { id: id, StripeID: stripeID } };

  const res = await request(updateUserProfile, variables);

  return res.data.updateUserProfile;
};

const resetTokens = async (id) => {
  const variables = { input: { id: id, TokenBalance: 0 } };

  const res = await request(updateUserProfile, variables);

  return res.data.updateUserProfile;
};

const updatePrice = async (id, price) => {
  const variables = { input: { id: id, SubscriptionPrice: price } };

  const res = await request(updateUserProfile, variables);

  return res.data.updateUserProfile;
};

const updateUserSubscriptionTrainer = gql`
  mutation UpdateUserSubscriptionTrainer(
    $input: UpdateUserSubscriptionTrainerInput!
  ) {
    UpdateUserSubscriptionTrainer(input: $input) {
      id
      CancelAtPeriodEnd
    }
  }
`;

const updatePeriodEnd = async (id) => {
  const variables = { input: { id: id, CancelAtPeriodEnd: true } };

  const res = await request(updateUserSubscriptionTrainer, variables);

  return res.data.UpdateUserSubscriptionTrainer;
};

module.exports = {
  getProfileByID,
  updatePrice,
  setStripeID,
  resetTokens,
  updatePeriodEnd,
};

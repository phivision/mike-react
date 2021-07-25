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

const queryByStripeID = async (stripeID) => {
  const profilesByStripeID = gql`
    query ProfilesByStripeID($StripeID: String) {
      profilesByStripeID(StripeID: $StripeID) {
        items {
          id
          Email
          RegDate
          StripeID
          BgTitle
          LastName
          FirstName
          UserRole
          Weight
          IsVerified
          LandingURL
          TokenBalance
          TokenPrice
          owner
        }
      }
    }
  `;

  const variables = { StripeID: stripeID };

  const res = await request(profilesByStripeID, variables);

  return res.data.profilesByStripeID;
};

const updateUserProfile = gql`
  mutation updateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      IsVerified
      TokenBalance
    }
  }
`;

const setVerified = async (id) => {
  const variables = { input: { id: id, IsVerified: true } };

  const res = await request(updateUserProfile, variables);

  return res;
};

const addTokens = async (id, currentTokenCount, amount) => {
  let curr = currentTokenCount ? currentTokenCount : 0;

  const variables = { input: { id: id, TokenBalance: curr + amount } };

  const res = await request(updateUserProfile, variables);

  return res;
};

module.exports = {
  queryByStripeID,
  setVerified,
  addTokens,
};

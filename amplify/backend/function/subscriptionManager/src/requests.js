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

const updateSubscription = async (id, expireDate) => {
  const updateUserSubscriptionTrainer = gql`
    mutation UpdateUserSubscriptionTrainer(
      $input: UpdateUserSubscriptionTrainerInput!
      $condition: ModelUserSubscriptionTrainerConditionInput
    ) {
      updateUserSubscriptionTrainer(input: $input, condition: $condition) {
        id
      }
    }
  `;

  const variables = { input: { id: id, ExpireDate: expireDate } };

  const res = await request(updateUserSubscriptionTrainer, variables);

  return res;
};

const getSubscriptionsByExpireDate = async (date) => {
  const subscriptionsByExpireDate = gql`
    query SubscriptionsByExpireDate($ExpireDate: AWSDate) {
      subscriptionsByExpireDate(ExpireDate: $ExpireDate) {
        items {
          id
          ExpireDate
          CancelAtPeriodEnd
          createdAt
          updatedAt
          Trainer {
            SubscriptionPrice
          }
          User {
            id
            TokenBalance
          }
        }
      }
    }
  `;

  const variables = { ExpireDate: date };

  const res = await request(subscriptionsByExpireDate, variables);

  return res.data.subscriptionsByExpireDate.items;
};

const deductTokens = async (id, currentTokenCount, amount) => {
  const updateUserProfile = gql`
    mutation updateUserProfile($input: UpdateUserProfileInput!) {
      updateUserProfile(input: $input) {
        id
        IsVerified
        TokenBalance
      }
    }
  `;

  let curr = currentTokenCount ? currentTokenCount : 0;

  const variables = { input: { id: id, TokenBalance: curr - amount } };

  const res = await request(updateUserProfile, variables);

  return res;
};

module.exports = {
  updateSubscription,
  getSubscriptionsByExpireDate,
  deductTokens,
};

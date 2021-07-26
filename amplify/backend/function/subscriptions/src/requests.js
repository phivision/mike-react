const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;

const graphql = require("graphql");
const gql = require("graphql-tag");
const { print } = graphql;
const v5 = require("uuid/v5");

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
        SubscriptionPrice
        UserRole
      }
    }
  `;
  const variables = { id: id };
  const res = await request(getUserProfile, variables);

  return res.data.getUserProfile;
};

const getUUID = async () => {
  const { Parameters } = await new AWS.SSM()
    .getParameters({
      Names: ["SEED_UUID"].map((secretName) => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();

  return Parameters.find((e) => e.Name === process.env.SEED_UUID).Value;
};

const createSubscription = async (trainerID, userID, expireDate) => {
  const createUserSubscriptionTrainer = gql`
    mutation createUserSubscriptionTrainer(
      $input: CreateUserSubscriptionTrainerInput!
    ) {
      createUserSubscriptionTrainer(input: $input) {
        id
        ExpireDate
        CancelAtPeriodEnd
      }
    }
  `;

  const UUID = await getUUID();
  const i = v5(trainerID + userID, UUID);
  const expire = new Date(expireDate * 1000).toISOString();
  const exp = expire.slice(0, 10);

  const variables = {
    input: {
      id: i,
      CancelAtPeriodEnd: false,
      userSubscriptionTrainerTrainerId: trainerID,
      userSubscriptionTrainerUserId: userID,
      ExpireDate: exp,
    },
  };

  const res = await request(createUserSubscriptionTrainer, variables);

  return res;
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

const deleteSubscription = async (trainerID, userID) => {
  const deleteUserSubscriptionTrainer = gql`
    mutation deleteUserSubscriptionTrainer(
      $input: DeleteUserSubscriptionTrainerInput!
    ) {
      deleteUserSubscriptionTrainer(input: $input) {
        id
      }
    }
  `;

  const i = v5(trainerID + userID, UUID);

  const variables = {
    input: {
      id: i,
    },
  };

  const res = await request(deleteUserSubscriptionTrainer, variables);

  return res;
};

module.exports = {
  deleteSubscription,
  createSubscription,
  getProfileByID,
  deductTokens,
};

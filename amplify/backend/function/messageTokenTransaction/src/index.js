const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const AWS = require("aws-sdk");
const gql = require("graphql-tag");
const AWSAppSyncClient = require("aws-appsync").default;
require("es6-promise").polyfill();
require("isomorphic-fetch");

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const url = process.env.API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;

AWS.config.update({
  region,
  credentials: new AWS.Credentials(
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
    process.env.AWS_SESSION_TOKEN
  ),
});
const credentials = AWS.config.credentials;

const appsyncClient = new AWSAppSyncClient(
  {
    url,
    region,
    auth: {
      type: "AWS_IAM",
      credentials,
    },
    disableOffline: true,
  },
  {
    defaultOptions: {
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
    },
  }
);
const queryTokenBalanceById = gql`
  query MyQuery($id: ID!) {
    getUserProfile(id: $id) {
      id
      TokenBalance
      UserRole
    }
  }
`;

const updateTokenBalance = gql`
  mutation MyMutation($id: ID!, $TokenBalance: Int) {
    updateUserProfile(input: { id: $id, TokenBalance: $TokenBalance }) {
      id
      TokenBalance
    }
  }
`;
const updateUserTokenBalance = async (msgModel) => {
  const fromUserId = msgModel.FromUserID.S;
  const toUserId = msgModel.ToUserID.S;
  return appsyncClient
    .hydrated()
    .then((client) => {
      return client
        .query({
          query: queryTokenBalanceById,
          variables: { id: fromUserId },
        })
        .then((d) => {
          const userRole = d.data.getUserProfile.UserRole;
          const tokenBalance = d.data.getUserProfile.TokenBalance;
          if (userRole === "student") {
            if (tokenBalance > 0) {
              return reduceStudentTokenBalance(
                fromUserId,
                toUserId,
                tokenBalance
              ).then((res) => {
                return res;
              });
            } else {
              return "Don't have enough tokenBalance";
            }
          } else {
            return "Don't need to mutate!";
          }
        })
        .catch((e) => {
          console.log(e);
          return e.message;
        });
    })
    .catch((e) => {
      console.log(e);
      return e.message;
    });
};
const reduceStudentTokenBalance = async (
  fromUserId,
  toUserId,
  tokenBalance
) => {
  return appsyncClient
    .hydrated()
    .then((client) => {
      client
        .mutate({
          mutation: updateTokenBalance,
          variables: { id: fromUserId, TokenBalance: tokenBalance - 1 },
        })
        .then(() => {
          return queryAndAddTrainerTokenBalance(toUserId).then((res) => {
            return res;
          });
        })
        .catch((e) => {
          console.log(e);
          return e.message;
        });
    })
    .catch((e) => {
      console.log(e);
      return e.message;
    });
};
const queryAndAddTrainerTokenBalance = async (trainerId) => {
  return appsyncClient
    .hydrated()
    .then((client) => {
      return client
        .query({
          query: queryTokenBalanceById,
          variables: { id: trainerId },
        })
        .then((d) => {
          var tokenBalance = d.data.getUserProfile.TokenBalance;
          if (tokenBalance == null) {
            tokenBalance = 1;
          } else {
            tokenBalance = tokenBalance + 1;
          }
          return appsyncClient
            .hydrated()
            .then((client) => {
              client
                .mutate({
                  mutation: updateTokenBalance,
                  variables: { id: trainerId, TokenBalance: tokenBalance },
                })
                .then(() => {
                  return "Add token balance to trainer!";
                })
                .catch((e) => {
                  console.log(e);
                  return e.message;
                });
            })
            .catch((e) => {
              console.log(e);
              return e.message;
            });
        })
        .catch((e) => {
          console.log(e);
          return e.message;
        });
    })
    .catch((e) => {
      console.log(e);
      return e.message;
    });
};
exports.handler = (event) => {
  var message;
  for (var i = 0; i < event.Records.length; i++) {
    const record = event.Records[i];
    if (record.eventName === "INSERT") {
      message = record.dynamodb.NewImage;
    }
  }
  if (message) {
    updateUserTokenBalance(message).then(() => {
      return Promise.resolve("Successfully process token transaction.");
    });
  } else {
    return Promise.resolve("No token transaction is processed.");
  }
};

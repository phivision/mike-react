const awsServerlessExpress = require('aws-serverless-express');
const appRoute = require('./app');
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

const server = awsServerlessExpress.createServer(appRoute);

exports.handler = async (event, context) => {
  const params = event.queryStringParameters;
  const userIds = params.userIds;
  console.log(`userIds: ${userIds}`);
  const fromUserId = params.fromUserId;
  console.log(`fromUserId: ${fromUserId}`);
  const message = params.message;
  console.log(`message: ${message}`);
  const userIdArr = userIds.split(',');
  console.log(`url: ${url}`);
  console.log(`region: ${region}`);
  for(i=0;i<userIdArr.length;i++){
    await sendMessageToUser(fromUserId,userIdArr[i],message);
  }
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
const sendMsgToUser = gql`
  mutation MyMutation($FromUserID: ID!, $PostMessages: String!, $ToUserID: ID!) {
    createMessage(input: {FromUserID: $FromUserID, PostMessages: $PostMessages, ToUserID: $ToUserID, Status: UNRESPONDED, Type: TEXT}) {
      id
      PostMessages
      FromUserID
      Status
      ToUserID
      Type
      createdAt
      ToUser {
        LastName
        UserImage
        FirstName
      }
      FromUser {
        LastName
        UserImage
        FirstName
      }
    }
  }
`;
const sendMessageToUser = async (fromUserId,toUserId,message) => {
    console.log(`log ${fromUserId}: ${toUserId} : ${message}`);
    const client = await appsyncClient.hydrated();
    const res = await client.mutate({
      mutation: sendMsgToUser,
      variables: { FromUserID: fromUserId, PostMessages: message,ToUserID: toUserId}
    });
    console.log(`res result: ${JSON.stringify(res)}}`);
}

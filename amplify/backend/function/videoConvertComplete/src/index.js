/* Amplify Params - DO NOT EDIT
	API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT
	API_MIKEAMPLIFY_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
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

const queryTranscodeStatusByName = gql`
  query ContentByName($ContentName: String) {
    contentByName(ContentName: $ContentName) {
      items {
        id
        TranscodeReady
      }
    }
  }
`;

const updateContentTranscodeStatus = gql`
  mutation UpdateUserContent($input: UpdateUserContentInput!) {
    updateUserContent(input: $input) {
      TranscodeReady
      CreatorID
      id
    }
  }
`;
const updateTranscodeStatus = async (event) => {
  const s3Bucket = event.detail.userMetadata.S3Bucket;
  const s3Env = s3Bucket.split("-").pop();
  // if in feature backend, use dev video pipeline
  if (process.env.ENV === s3Env) {
    const s3Key = event.detail.userMetadata.S3Key;
    const contentName = s3Key.split("/").pop();
    console.log("Transcoding is completed for content: ", contentName);
    // query appsync
    return appsyncClient
      .hydrated()
      .then((client) => {
        return client.query({
          query: queryTranscodeStatusByName,
          variables: { ContentName: contentName },
        });
      })
      .then(async (d) => {
        const transcodeReady = d.data.contentByName.items[0].TranscodeReady;
        // console.log("current transcode status ", transcodeReady);
        if (!transcodeReady) {
          const contentID = d.data.contentByName.items[0].id;
          return appsyncClient.hydrated().then((client) => {
            return client
              .mutate({
                mutation: updateContentTranscodeStatus,
                variables: { input: { id: contentID, TranscodeReady: true } },
              })
              .then((d) => {
                // console.log(d.data.updateContentTranscodeStatus);
                return "Updated video transcode status!";
              })
              .catch((e) => {
                console.log(e);
                return e.message;
              });
          });
        } else {
          return "Transcode is already done!";
        }
      })
      .catch((e) => {
        console.log(e);
        return e.message;
      });
  } else {
    return "The query is not running since env mismatch!";
  }
};

exports.handler = async (event) => {
  console.log(event);
  return updateTranscodeStatus(event).then((res) => {
    return {
      statusCode: 200,
      //  Uncomment below to enable CORS requests
      //  headers: {
      //      "Access-Control-Allow-Origin": "*",
      //      "Access-Control-Allow-Headers": "*"
      //  },
      body: JSON.stringify(res),
    };
  });
};

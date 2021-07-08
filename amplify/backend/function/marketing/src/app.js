/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["MAILCHIMP_API_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
const asyncHandler = require("express-async-handler");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const trainerCTA = "513c9c2876";
const AWS = require("aws-sdk");
var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(
  asyncHandler(async (req, res, next) => {
    const { Parameters } = await new AWS.SSM()
      .getParameters({
        Names: ["MAILCHIMP_API_KEY"].map(
          (secretName) => process.env[secretName]
        ),
        WithDecryption: true,
      })
      .promise();

    const apiKey = Parameters.find(
      (e) => e.Name === process.env.MAILCHIMP_API_KEY
    ).Value;

    mailchimp.setConfig({
      apiKey: apiKey,
      server: "us6",
    });

    next();
  })
);

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.post(
  "/marketing",
  asyncHandler(async (req, res, next) => {
    const subscribe = async () => {
      const query = {
        email_address: req.body.email,
        status: "subscribed",
      };

      const response = await mailchimp.lists.addListMember(trainerCTA, query);

      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );
    };

    subscribe().then(() => {
      res.status(200).send();
    });
  })
);

app.post("/*", function (req, res) {
  console.log("Route not found.");
  res.status(404).send();
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
